-- ==============================================================================
-- TRIVA OUTDOOR MOBILE CRM - INITIAL SCHEMA MIGRATION
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist";

-- 2. CUSTOM TYPES & ENUMS
create type user_role as enum ('admin', 'staff', 'customer');
create type item_status as enum ('available', 'rented', 'maintenance');
create type rental_status as enum ('pending_dp', 'confirmed', 'active', 'returned', 'cancelled');
create type payment_method as enum ('cash', 'transfer', 'qris');
create type payment_type as enum ('dp', 'settlement', 'penalty');
create type penalty_type as enum ('late', 'damage', 'missing', 'cleaning');

-- 3. PROFILES TABLE (Linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone_wa text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. CATEGORIES TABLE
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. ITEMS TABLE (Master Inventory with unique unit code)
create table public.items (
  id uuid primary key default gen_random_uuid(),
  unit_code text not null unique, -- Contoh: TND-01, CR-01
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  price_per_day numeric(12, 2) not null check (price_per_day >= 0),
  status item_status not null default 'available',
  image_url text,
  condition_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. RENTALS TABLE (Transactions)
create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique, -- Contoh: TRV-261030-001
  customer_id uuid not null references public.profiles(id) on delete restrict,
  handled_by uuid references public.profiles(id) on delete set null,
  start_date date not null,
  end_date date not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  down_payment numeric(12, 2) not null default 0 check (down_payment >= 0),
  remaining_amount numeric(12, 2) not null default 0 check (remaining_amount >= 0),
  status rental_status not null default 'pending_dp',
  ktp_photo_path text, -- Path aman di private storage (BUKAN URL publik)
  notes text,
  actual_return_time timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_rental_dates check (end_date >= start_date)
);

-- 7. RENTAL_ITEMS TABLE (Items assigned to a rental)
create table public.rental_items (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete restrict,
  price_per_day numeric(12, 2) not null check (price_per_day >= 0),
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true, -- true saat pending_dp, confirmed, atau active
  created_at timestamptz not null default now(),
  constraint valid_item_rental_dates check (end_date >= start_date)
);

-- ANTI DOUBLE-BOOKING EXCLUSION CONSTRAINT
-- Mencegah unit fisik yang sama dibooking di rentang tanggal yang bersinggungan
alter table public.rental_items
add constraint no_overlapping_rental_items
exclude using gist (
  item_id with =,
  daterange(start_date, end_date, '[]') with &&
)
where (is_active = true);

-- 8. PAYMENTS TABLE (DP, Pelunasan, Denda)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  method payment_method not null,
  type payment_type not null,
  amount numeric(12, 2) not null check (amount > 0),
  proof_path text, -- Path file bukti transfer di private storage
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- 9. PENALTIES TABLE (Denda keterlambatan / kerusakan)
create table public.penalties (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  type penalty_type not null,
  amount numeric(12, 2) not null check (amount >= 0),
  notes text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 10. SETTINGS TABLE (Konfigurasi dinamis toko tanpa hardcode)
create table public.settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index idx_items_category on public.items(category_id);
create index idx_items_status on public.items(status);
create index idx_rentals_customer on public.rentals(customer_id);
create index idx_rentals_status on public.rentals(status);
create index idx_rentals_dates on public.rentals(start_date, end_date);
create index idx_rental_items_rental on public.rental_items(rental_id);
create index idx_rental_items_item on public.rental_items(item_id);
create index idx_payments_rental on public.payments(rental_id);
create index idx_penalties_rental on public.penalties(rental_id);

-- ==============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Fungsi bantu mendapatkan role user yang sedang login
create or replace function public.current_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Trigger: Update updated_at otomatis
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.handle_updated_at();

create trigger set_items_updated_at
before update on public.items
for each row execute function public.handle_updated_at();

create trigger set_rentals_updated_at
before update on public.rentals
for each row execute function public.handle_updated_at();

-- Trigger: Otomatis sinkronisasi is_active pada rental_items saat status rental berubah
create or replace function public.sync_rental_status()
returns trigger as $$
begin
  -- Jika rental dibatalkan atau barang sudah kembali, lepaskan proteksi constraint
  if new.status in ('returned', 'cancelled') then
    update public.rental_items
    set is_active = false
    where rental_id = new.id;

    -- Kembalikan status item fisik menjadi available
    update public.items
    set status = 'available'
    where id in (select item_id from public.rental_items where rental_id = new.id);

  elsif new.status = 'active' then
    update public.rental_items
    set is_active = true
    where rental_id = new.id;

    -- Ubah status item fisik menjadi rented
    update public.items
    set status = 'rented'
    where id in (select item_id from public.rental_items where rental_id = new.id);
  else
    update public.rental_items
    set is_active = true
    where rental_id = new.id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trigger_sync_rental_status
after update of status on public.rentals
for each row execute function public.sync_rental_status();

-- Trigger: Otomatis buat profil saat user daftar di auth.users (default role: customer)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_wa, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone_wa',
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Trigger Keamanan: Cegah Privilege Escalation (User tidak bisa ubah role diri sendiri)
create or replace function public.prevent_self_role_escalation()
returns trigger as $$
begin
  if new.role != old.role and public.current_user_role() != 'admin' then
    raise exception 'Tidak memiliki izin untuk mengubah role akun!';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_prevent_role_escalation
before update of role on public.profiles
for each row execute function public.prevent_self_role_escalation();

-- Generator Booking Code Unik (Contoh: TRV-YYMMDD-XXXX)
create or replace function public.generate_booking_code()
returns trigger as $$
declare
  prefix text;
  seq text;
begin
  if new.booking_code is null or new.booking_code = '' then
    prefix := 'TRV-' || to_char(now(), 'YYMMDD') || '-';
    seq := upper(substr(md5(random()::text), 1, 4));
    new.booking_code := prefix || seq;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_generate_booking_code
before insert on public.rentals
for each row execute function public.generate_booking_code();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.rentals enable row level security;
alter table public.rental_items enable row level security;
alter table public.payments enable row level security;
alter table public.penalties enable row level security;
alter table public.settings enable row level security;

-- PROFILES POLICIES
create policy "User dapat membaca profil sendiri"
on public.profiles for select
using (auth.uid() = id or public.current_user_role() in ('admin', 'staff'));

create policy "User dapat mengubah data profil sendiri (kecuali role)"
on public.profiles for update
using (auth.uid() = id or public.current_user_role() = 'admin');

-- CATEGORIES & ITEMS POLICIES (Publik dapat melihat katalog, hanya Admin dapat mengelola)
create policy "Semua orang dapat melihat kategori"
on public.categories for select
using (true);

create policy "Hanya Admin yang dapat mengelola kategori"
on public.categories for all
using (public.current_user_role() = 'admin');

create policy "Semua orang dapat melihat katalog barang"
on public.items for select
using (true);

create policy "Hanya Admin yang dapat mengelola master barang"
on public.items for all
using (public.current_user_role() = 'admin');

-- RENTALS POLICIES
create policy "Konsumen dapat melihat sewanya sendiri, Staf/Admin dapat melihat semua"
on public.rentals for select
using (customer_id = auth.uid() or public.current_user_role() in ('admin', 'staff'));

create policy "Konsumen dapat membuat pesanan sewa baru"
on public.rentals for insert
with check (customer_id = auth.uid());

create policy "Staf dan Admin dapat memperbarui status sewa"
on public.rentals for update
using (public.current_user_role() in ('admin', 'staff'));

-- RENTAL_ITEMS POLICIES
create policy "Melihat rincian item sewa sesuai izin rental"
on public.rental_items for select
using (
  exists (
    select 1 from public.rentals r
    where r.id = rental_items.rental_id
    and (r.customer_id = auth.uid() or public.current_user_role() in ('admin', 'staff'))
  )
);

create policy "Membuat rincian item sewa saat booking"
on public.rental_items for insert
with check (
  exists (
    select 1 from public.rentals r
    where r.id = rental_items.rental_id
    and r.customer_id = auth.uid()
  ) or public.current_user_role() in ('admin', 'staff')
);

create policy "Hanya Staf dan Admin yang dapat mengedit item sewa"
on public.rental_items for update
using (public.current_user_role() in ('admin', 'staff'));

-- PAYMENTS POLICIES
create policy "Melihat data pembayaran"
on public.payments for select
using (
  exists (
    select 1 from public.rentals r
    where r.id = payments.rental_id
    and (r.customer_id = auth.uid() or public.current_user_role() in ('admin', 'staff'))
  )
);

create policy "Konsumen dapat mengunggah bukti DP, Staf/Admin mencatat pelunasan"
on public.payments for insert
with check (
  exists (
    select 1 from public.rentals r
    where r.id = payments.rental_id
    and r.customer_id = auth.uid()
  ) or public.current_user_role() in ('admin', 'staff')
);

create policy "Hanya Staf dan Admin yang memverifikasi pembayaran"
on public.payments for update
using (public.current_user_role() in ('admin', 'staff'));

-- PENALTIES POLICIES
create policy "Melihat data denda sewa"
on public.penalties for select
using (
  exists (
    select 1 from public.rentals r
    where r.id = penalties.rental_id
    and (r.customer_id = auth.uid() or public.current_user_role() in ('admin', 'staff'))
  )
);

create policy "Hanya Staf dan Admin yang dapat membuat denda"
on public.penalties for insert
with check (public.current_user_role() in ('admin', 'staff'));

-- SETTINGS POLICIES
create policy "Semua pengguna terotentikasi dapat membaca pengaturan toko"
on public.settings for select
using (auth.role() = 'authenticated');

create policy "Hanya Admin yang dapat mengubah pengaturan toko"
on public.settings for all
using (public.current_user_role() = 'admin');

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Private for security)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values 
  ('ktp-guarantees', 'ktp-guarantees', false),
  ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Storage RLS: ktp-guarantees (HANYA Staff & Admin yang boleh akses foto KTP)
create policy "Hanya Staf dan Admin yang dapat melihat dan upload KTP"
on storage.objects for all
using (
  bucket_id = 'ktp-guarantees' and public.current_user_role() in ('admin', 'staff')
);

-- Storage RLS: payment-proofs (Konsumen bisa upload bukti, Staf/Admin bisa baca)
create policy "Konsumen dapat upload bukti pembayaran"
on storage.objects for insert
with check (
  bucket_id = 'payment-proofs' and auth.role() = 'authenticated'
);

create policy "Staf, Admin, dan pemilik akun dapat melihat bukti pembayaran"
on storage.objects for select
using (
  bucket_id = 'payment-proofs' and (
    public.current_user_role() in ('admin', 'staff') or 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);
