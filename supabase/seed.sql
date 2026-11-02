-- ==============================================================================
-- TRIVA OUTDOOR MOBILE CRM - SEED DATA
-- Catatan: Data awal terpisah untuk pengujian dan inisialisasi awal toko
-- ==============================================================================

-- 1. KATEGORI ALAT OUTDOOR
insert into public.categories (id, name, slug, icon, description) values
  ('c1000000-0000-0000-0000-000000000001', 'Tenda Gunung', 'tenda', 'Tent', 'Tenda dome berbagai kapasitas (2P, 4P, 6P) tahan badai'),
  ('c1000000-0000-0000-0000-000000000002', 'Carrier & Ransel', 'carrier', 'Backpack', 'Tas gunung ergonomis kapasitas 45L s/d 80L'),
  ('c1000000-0000-0000-0000-000000000003', 'Alat Masak', 'alat-masak', 'Utensils', 'Kompor portable, nesting camping, dan peralatan masak lapangan'),
  ('c1000000-0000-0000-0000-000000000004', 'Pakaian & Jaket', 'pakaian-jaket', 'Shirt', 'Jaket windproof, jas hujan gunung, dan celana quickdry'),
  ('c1000000-0000-0000-0000-000000000005', 'Aksesoris & Perlengkapan', 'aksesoris', 'Compass', 'Headlamp, trekking pole, sleeping bag, dan matras aluminium'),
  ('c1000000-0000-0000-0000-000000000006', 'Paket Hemat', 'paket-hemat', 'Package', 'Paket bundling lengkap siap mendaki dengan harga ekonomis')
on conflict (slug) do nothing;

-- 2. MASTER UNIT INVENTARIS FISIK
insert into public.items (unit_code, category_id, name, price_per_day, status, condition_notes) values
  ('TND-01', 'c1000000-0000-0000-0000-000000000001', 'Tenda Eiger Shira 4 Orang', 45000, 'available', 'Lengkap: Frame alloy, pasak 10 pcs, outer utuh tanpa sobek'),
  ('TND-02', 'c1000000-0000-0000-0000-000000000001', 'Tenda Eiger Shira 4 Orang', 45000, 'available', 'Lengkap: Frame alloy, pasak 10 pcs, seal jahitan aman'),
  ('TND-03', 'c1000000-0000-0000-0000-000000000001', 'Tenda Arei Eliot 2 Orang', 30000, 'available', 'Kondisi prima: Sangat ringan, pasak 8 pcs lengkap'),
  ('CR-01', 'c1000000-0000-0000-0000-000000000002', 'Carrier Osprey Atmos AG 65L', 40000, 'available', 'Termasuk raincover original, busa pinggang empuk'),
  ('CR-02', 'c1000000-0000-0000-0000-000000000002', 'Carrier Deuter Aircontact 60+10L', 35000, 'available', 'Termasuk raincover, buckle lengkap tidak ada yang patah'),
  ('MSK-01', 'c1000000-0000-0000-0000-000000000003', 'Kompor Mawar Windproof + Nesting DS-308', 20000, 'available', 'Pemantik kompor berfungsi normal, panci nesting bersih'),
  ('SB-01', 'c1000000-0000-0000-0000-000000000005', 'Sleeping Bag Bulu Angsa TRIVA', 15000, 'available', 'Hangat sampai 5°C, kantong kompresi utuh'),
  ('SB-02', 'c1000000-0000-0000-0000-000000000005', 'Sleeping Bag Bulu Angsa TRIVA', 15000, 'available', 'Hangat sampai 5°C, kantong kompresi utuh'),
  ('HL-01', 'c1000000-0000-0000-0000-000000000005', 'Headlamp USB Rechargeable 500 Lumens', 10000, 'available', 'Baterai awet, kabel USB lengkap'),
  ('PKT-01', 'c1000000-0000-0000-0000-000000000006', 'Paket Summit Berdua (Tenda 2P + 2 SB + Kompor)', 70000, 'available', 'Paket hemat sepasang pendaki')
on conflict (unit_code) do nothing;

-- 3. PENGATURAN DEFAULT TOKO (SETTINGS)
insert into public.settings (key, value, description) values
  ('store_name', 'TRIVA Outdoor Rental', 'Nama resmi toko rental'),
  ('store_tagline', 'Style on the Trail', 'Tagline brand TRIVA'),
  ('store_phone_wa', '6281234567890', 'Nomor WhatsApp resmi toko untuk pesan nota'),
  ('store_address', 'Jl. Pendakian Raya No. 12, Puncak', 'Alamat toko fisik untuk pengambilan barang'),
  ('min_dp_percentage', '30', 'Minimal uang muka saat booking (%)'),
  ('late_fee_per_day', '25000', 'Tarif denda keterlambatan per hari (Rp)'),
  ('return_deadline_hour', '21:00', 'Batas maksimal jam pengembalian (WIB)'),
  ('ktp_retention_days', '7', 'Masa retensi foto KTP setelah sewa selesai sebelum dihapus (hari)')
on conflict (key) do update set value = excluded.value;
