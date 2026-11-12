import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# 16:9 Widescreen Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette
COLOR_CRIMSON = RGBColor(133, 25, 25)       # #851919
COLOR_SLATE_900 = RGBColor(15, 23, 42)      # #0F172A
COLOR_SLATE_700 = RGBColor(51, 65, 85)      # #334155
COLOR_SLATE_500 = RGBColor(100, 116, 139)   # #64748B
COLOR_LIGHT_BG = RGBColor(248, 250, 252)    # #F8FAFC
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0
COLOR_ROSE_TINT = RGBColor(255, 241, 242)   # #FFF1F2
COLOR_GREEN = RGBColor(16, 185, 129)        # #10B981

IMG_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\0a1b8e86-587f-43b3-81d4-131d42bdadd4"
blank_slide_layout = prs.slide_layouts[6] # completely blank layout

def add_header(slide, slide_num, title, category="TRIVA OUTDOOR RENTAL — PRD v2.1"):
    # Header bar
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = COLOR_CRIMSON
    top_bar.line.fill.background()

    # Category / Breadcrumb
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.3), Inches(10), Inches(0.4))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = f"SLIDE {slide_num:02d} | {category.upper()}"
    p_cat.font.name = "Arial"
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = COLOR_CRIMSON

    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.5), Inches(0.7))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.name = "Arial"
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = COLOR_SLATE_900

def add_card(slide, left, top, width, height, bg_color=COLOR_LIGHT_BG, border_color=COLOR_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1)
    return card

def set_speaker_notes(slide, notes_text):
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.text = notes_text

# ==========================================
# SLIDE 1: COVER
# ==========================================
slide1 = prs.slides.add_slide(blank_slide_layout)

# Background Accent Banner
bg_banner = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
bg_banner.fill.solid()
bg_banner.fill.fore_color.rgb = COLOR_SLATE_900
bg_banner.line.fill.background()

# Crimson Accent Stripe
stripe = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.4), Inches(7.5))
stripe.fill.solid()
stripe.fill.fore_color.rgb = COLOR_CRIMSON
stripe.line.fill.background()

# Title text box
tb1 = slide1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(6.5), Inches(5.0))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_badge = tf1.paragraphs[0]
p_badge.text = "PRODUCT REQUIREMENT DOCUMENT (PRD) V2.1"
p_badge.font.name = "Arial"
p_badge.font.size = Pt(11)
p_badge.font.bold = True
p_badge.font.color.rgb = RGBColor(244, 63, 94) # Pink-rose accent
p_badge.space_after = Pt(12)

p_main = tf1.add_paragraph()
p_main.text = "TRIVA OUTDOOR\nRENTAL"
p_main.font.name = "Arial"
p_main.font.size = Pt(40)
p_main.font.bold = True
p_main.font.color.rgb = COLOR_WHITE
p_main.space_after = Pt(10)

p_tagline = tf1.add_paragraph()
p_tagline.text = "Style on the Trail"
p_tagline.font.name = "Arial"
p_tagline.font.size = Pt(20)
p_tagline.font.italic = True
p_tagline.font.color.rgb = RGBColor(253, 164, 175) # Soft pink
p_tagline.space_after = Pt(18)

p_desc = tf1.add_paragraph()
p_desc.text = "Modernisasi Bisnis Persewaan Alat Outdoor Berbasis SaaS & Mobile PWA dengan Otomasi Booking DP 30%, Brankas Jaminan KTP Fisik, dan Pelaporan Keuangan Eksekutif."
p_desc.font.name = "Arial"
p_desc.font.size = Pt(13)
p_desc.font.color.rgb = RGBColor(203, 213, 225) # Slate 300
p_desc.space_after = Pt(24)

p_meta = tf1.add_paragraph()
p_meta.text = "Presenter: Rifki Apirin (Owner & Lead Dev) | Hotline CS: 083851284143"
p_meta.font.name = "Arial"
p_meta.font.size = Pt(11)
p_meta.font.color.rgb = COLOR_WHITE

# Hero Image on right
img1_path = os.path.join(IMG_DIR, "01_hero_showcase.png")
if os.path.exists(img1_path):
    slide1.shapes.add_picture(img1_path, Inches(8.0), Inches(1.3), width=Inches(4.6))

set_speaker_notes(slide1, 
    "Selamat pagi / siang rekan-rekan dan bapak/ibu sekalian. Hari ini saya bangga mempersembahkan TRIVA Outdoor Rental dengan tagline 'Style on the Trail'. "
    "Di era di mana aktivitas mendaki gunung dan berkemah telah menjadi bagian dari gaya hidup generasi muda, bisnis persewaan outdoor membutuhkan transformasi digital "
    "yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang estetik, cepat, dan terpercaya. Inilah alasan mengapa kami membangun TRIVA Outdoor Rental."
)

# Helper function for Standard 2-Column Slide (Left: Content, Right: Image)
def create_standard_slide(slide_num, title, category, key_points, talking_script, img_filename):
    slide = prs.slides.add_slide(blank_slide_layout)
    add_header(slide, slide_num, title, category)

    # Left Container Card
    add_card(slide, Inches(0.8), Inches(1.4), Inches(6.0), Inches(5.6))

    # Left Text Box
    tb = slide.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(5.6), Inches(5.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "POIN KUNCI & FITUR BISNIS"
    p0.font.name = "Arial"
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_CRIMSON
    p0.space_after = Pt(12)

    for pt in key_points:
        p = tf.add_paragraph()
        p.text = f"•  {pt}"
        p.font.name = "Arial"
        p.font.size = Pt(12.5)
        p.font.color.rgb = COLOR_SLATE_700
        p.space_after = Pt(10)

    # Right Image Frame
    if img_filename:
        img_path = os.path.join(IMG_DIR, img_filename)
        if os.path.exists(img_path):
            add_card(slide, Inches(7.1), Inches(1.4), Inches(5.5), Inches(5.6), bg_color=COLOR_WHITE)
            slide.shapes.add_picture(img_path, Inches(7.25), Inches(1.55), width=Inches(5.2))

    set_speaker_notes(slide, talking_script)
    return slide

# ==========================================
# SLIDE 2: LATAR BELAKANG & MASALAH BISNIS
# ==========================================
create_standard_slide(
    2,
    "Latar Belakang: 4 Masalah Klasik Rental Outdoor & Solusi TRIVA",
    "Problem & Solution Statement",
    [
        "Masalah 1 - Risiko Kehilangan & Kerusakan Alat: Toko konvensional seringkali lupa menahan jaminan identitas asli tanpa standardisasi inspeksi fisik.",
        "Masalah 2 - Pembukuan Kas Amburadul: Uang muka (DP), sisa pelunasan di toko, dan denda sering bercampur di buku manual tanpa rekonsiliasi digital.",
        "Masalah 3 - Pemesanan Tidak Realtime: Pelanggan kesulitan mengecek ketersediaan tenda atau carrier sebelum datang ke toko.",
        "Masalah 4 - Branding Usang: Kurangnya sentuhan kurasi visual yang membangun kepercayaan para pendaki.",
        "Solusi TRIVA: SaaS & Mobile PWA terintegrasi dengan kodefikasi unit, booking DP 30%, brankas KTP fisik, dan dasbor eksekutif."
    ],
    "Bapak/Ibu sekalian, bisnis sewa alat outdoor konvensional memiliki kerentanan besar: alat hilang karena jaminan tidak tertib, kas DP dan pelunasan toko tercecer di buku tulis, serta calon pendaki yang kecewa karena alat habis saat tiba di basecamp. TRIVA Outdoor Rental memecahkan seluruh masalah ini. Melalui katalog kategori terstruktur yang Anda lihat di layar—mulai dari Tenda Dome, Carrier Ergonomis, hingga Peralatan Memasak—semua unit terdata secara realtime sehingga pelanggan tahu persis ketersediaan alat sebelum menyewa.",
    "02_kategori_outdoor.png"
)

# ==========================================
# SLIDE 3: GALERI KOMUNITAS #STYLEONTHETRAIL
# ==========================================
create_standard_slide(
    3,
    "Social Proof & Komunitas: Galeri #StyleOnTheTrail (UGC Nyata)",
    "Community Engagement & Reliability",
    [
        "Dokumentasi Pendakian Nyata: Foto pendaki asli di Puncak Gede (2.958 MDPL), Gunung Sagara (2.132 MDPL), Papandayan, dan Prau.",
        "Role-Based Access Control (RBAC): Tombol 'Ganti Foto' eksklusif untuk Admin; customer umum hanya dapat melihat & like.",
        "Kompresi Otomatis Client-Side: Mengompres foto kamera ponsel (5MB-10MB) via Canvas menjadi ~90KB ramah memori tanpa pecah.",
        "Penyimpanan Berlapis Anti-Reset: Disimpan permanen di IndexedDB, LocalStorage, dan file server, menjamin foto tidak pernah hilang saat refresh."
    ],
    "Kepercayaan pelanggan outdoor dibangun lewat bukti nyata di lapangan. Pada layar ini, kita melihat Galeri Komunitas #StyleOnTheTrail yang menampilkan foto-foto pendaki asli menggunakan perlengkapan kami di Puncak Gede, Gunung Sagara, dan Hutan Mati Papandayan. Khusus untuk pemilik toko, sistem menyediakan fitur ganti foto interaktif dengan teknologi kompresi otomatis client-side. Gambar dikompresi seketika agar hemat penyimpanan dan diproteksi dengan penyimpanan berlapis sehingga galeri tetap permanen dan tidak pernah kembali ke bawaan saat halaman diperbarui.",
    "03_galeri_komunitas_styleonthetrail.png"
)

# ==========================================
# SLIDE 4: FLOATING WHATSAPP CS HOTLINE
# ==========================================
create_standard_slide(
    4,
    "Layanan Pelanggan Instan: Floating WhatsApp CS (083851284143)",
    "Instant Customer Support",
    [
        "Nomor Hotline Terverifikasi: Terhubung langsung ke WhatsApp Admin di 083851284143 (+62 838-5128-4143).",
        "Desain Ergonomis Mobile: Terpasang di posisi 'bottom-20 right-4' di ponsel agar tidak menutupi bottom navigation bar.",
        "Quick Chips Respons Cepat: Tombol instan untuk konfirmasi pembayaran DP, kendala serah terima alat, atau booking khusus.",
        "Format Pesan Otomatis: Membuat template pesan WhatsApp rapi dan terstruktur secara instan satu kali klik."
    ],
    "Kami memahami bahwa pendaki sering membutuhkan konsultasi cepat sebelum berangkat: apakah tenda ini tahan badai? Bagaimana cara konfirmasi DP? Untuk itu, TRIVA menyematkan Floating WhatsApp Widget di seluruh halaman. Dilengkapi tombol opsi instan atau Quick Chips, pengguna cukup satu kali klik untuk membuka obrolan langsung ke WhatsApp Admin di 083851284143 dengan pesan yang sudah terformat rapi. Posisi tombol juga telah dioptimasi secara ergonomis agar nyaman dioperasikan satu tangan pada perangkat ponsel.",
    "04_floating_whatsapp_widget.png"
)

# ==========================================
# SLIDE 5: MANAJEMEN INVENTARIS UNIT
# ==========================================
create_standard_slide(
    5,
    "Manajemen Inventaris Cerdas: Kodefikasi Unit & Status Realtime",
    "Asset & Inventory Tracking",
    [
        "Kodefikasi Unit Individual: Setiap unit memiliki kode unik (TND-01 untuk Tenda Dome 4P, CR-01 untuk Carrier 60L, SPT-02 untuk Sepatu Vibram).",
        "Siklus 3 Status Fisik: 'available' (siap disewa di toko), 'rented' (sedang dibawa pendaki), dan 'maintenance' (sedang dicuci/servis).",
        "Pencegahan Overbooking: Pelanggan tidak dapat menyewa unit yang sedang berada di status 'rented' atau 'maintenance'.",
        "Filter & Pencarian Instan: Memudahkan pencarian unit berdasarkan kategori dan ketersediaan dalam hitungan milidetik."
    ],
    "Salah satu kesalahan fatal pada rental tradisional adalah overbooking—dua pelanggan menyewa tenda yang sama di tanggal yang sama. Di TRIVA, setiap alat memiliki kode unit unik, seperti TND-01 atau CR-01. Sistem inventaris kami membagi status menjadi tiga kondisi jelas: Tersedia, Sedang Disewa, atau Perawatan. Admin dapat memantau secara presisi unit mana yang sedang berada di atas gunung dan unit mana yang sudah siap di rak toko.",
    "05_katalog_inventaris_unit.png"
)

# ==========================================
# SLIDE 6: ALUR PEMESANAN & DP 30%
# ==========================================
create_standard_slide(
    6,
    "Alur Pemesanan Fleksibel: Minimal DP 30% & QRIS Instan",
    "Booking Flow & Dynamic Down Payment",
    [
        "Kalkulasi Otomatis: Total Biaya = Harga per Hari x Durasi Sewa x Jumlah Unit.",
        "Uang Muka Minimal 30%: Menjamin komitmen sewa tanpa memberatkan pelanggan membayar penuh 100% di awal.",
        "Pembayaran QRIS 15 Menit: Terintegrasi dengan QRIS instan yang dapat discan oleh seluruh m-banking dan e-wallet.",
        "Transparansi Sisa Tagihan: Sistem menampilkan rincian sisa 70% yang wajib dilunasi saat serah terima barang di toko."
    ],
    "TRIVA memberikan fleksibilitas pembayaran yang sangat disukai para petualang. Alih-alih mewajibkan bayar lunas 100% di muka, sistem kami secara otomatis menghitung Down Payment minimal 30%. Seperti yang terlihat pada modal booking di layar: untuk total sewa Rp 150.000 selama 3 hari, penyewa cukup membayar DP Rp 45.000 via QRIS untuk mengamankan unit. Sisa Rp 105.000 baru akan dilunasi saat mereka mengambil barang di toko.",
    "06_modal_booking_dp_30persen.png"
)

# ==========================================
# SLIDE 7: SOP SERAH TERIMA & BRANKAS KTP (Diagram Card Slide)
# ==========================================
slide7 = prs.slides.add_slide(blank_slide_layout)
add_header(slide7, 7, "Prosedur Operasional Toko: Serah Terima & Brankas KTP", "SOP Handover Settlement")

steps_data = [
    ("1. Verifikasi Identitas", "Staf toko mencocokkan wajah penyewa dengan identitas KTP/SIM fisik asli untuk menjamin keabsahan.", COLOR_CRIMSON),
    ("2. Inspeksi Alat Bersama", "Pengecekan fisik kondisi tenda, frame, resleting carrier, dan kelengkapan alat masak bersama pelanggan.", COLOR_SLATE_900),
    ("3. Simpan Jaminan di Brankas", "KTP fisik asli penyewa disimpan ke dalam brankas khusus toko TRIVA selama masa pendakian berlangsung.", COLOR_CRIMSON),
    ("4. Pelunasan Sisa Biaya", "Sisa 70% tagihan sewa dilunasi langsung di meja kasir toko (Tunai atau QRIS Toko).", COLOR_SLATE_900),
    ("5. Status Berubah 'Active'", "Sistem memperbarui status sewa menjadi 'Active' (Sedang Disewa) dan alat resmi diserahkan.", COLOR_GREEN)
]

for idx, (stitle, sdesc, scolor) in enumerate(steps_data):
    x = Inches(0.8 + idx * 2.4)
    card_s = add_card(slide7, x, Inches(1.5), Inches(2.2), Inches(4.5), bg_color=COLOR_WHITE)
    
    top_badge = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.15), Inches(1.7), Inches(1.9), Inches(0.6))
    top_badge.fill.solid()
    top_badge.fill.fore_color.rgb = scolor
    top_badge.line.fill.background()
    p_b = top_badge.text_frame.paragraphs[0]
    p_b.text = f"LANGKAH {idx+1}"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_WHITE
    p_b.alignment = PP_ALIGN.CENTER
    
    tb_step = slide7.shapes.add_textbox(x + Inches(0.1), Inches(2.5), Inches(2.0), Inches(3.2))
    tf_s = tb_step.text_frame
    tf_s.word_wrap = True
    
    p_st = tf_s.paragraphs[0]
    p_st.text = stitle
    p_st.font.size = Pt(13)
    p_st.font.bold = True
    p_st.font.color.rgb = COLOR_SLATE_900
    p_st.space_after = Pt(8)
    
    p_sd = tf_s.add_paragraph()
    p_sd.text = sdesc
    p_sd.font.size = Pt(11)
    p_sd.font.color.rgb = COLOR_SLATE_700

# Summary bar below
sum_card = add_card(slide7, Inches(0.8), Inches(6.2), Inches(11.8), Inches(0.8), bg_color=COLOR_ROSE_TINT, border_color=COLOR_CRIMSON)
tb_sum = slide7.shapes.add_textbox(Inches(1.0), Inches(6.25), Inches(11.4), Inches(0.7))
p_sum = tb_sum.text_frame.paragraphs[0]
p_sum.text = "🛡️ Keamanan Berlapis: Menghilangkan risiko alat hilang, menjamin kas toko tertib, dan menjaga kepatuhan pelanggan."
p_sum.font.size = Pt(12)
p_sum.font.bold = True
p_sum.font.color.rgb = COLOR_CRIMSON

set_speaker_notes(slide7, 
    "Bagaimana TRIVA melindungi aset alat dari risiko hilang? Jawabannya ada pada SOP Handover Settlement. "
    "Saat pendaki datang ke toko kami, staf akan memvalidasi fisik KTP asli dan menyimpannya di brankas jaminan. "
    "Pada saat bersamaan, sisa tagihan sewa dilunasi di meja kasir baik dengan uang tunai maupun scan QRIS toko. "
    "Setelah semua klir, staf menekan tombol 'Selesaikan Serah Terima' dan status alat berpindah menjadi Active. Ini adalah standar keamanan berlapis yang sangat solid."
)

# ==========================================
# SLIDE 8: SEWA AKTIF VS RIWAYAT TRANSAKSI (2 Images Side-by-Side)
# ==========================================
slide8 = prs.slides.add_slide(blank_slide_layout)
add_header(slide8, 8, "Navigasi Terstruktur: Sewa Aktif vs Riwayat Transaksi", "UX Separation Architecture")

# Left Column: Sewa Saya Aktif
add_card(slide8, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.6))
tb8_l = slide8.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(5.3), Inches(2.2))
tf8_l = tb8_l.text_frame
tf8_l.word_wrap = True
p8_lh = tf8_l.paragraphs[0]
p8_lh.text = "1. TAB 'SEWA SAYA' (PESANAN AKTIF)"
p8_lh.font.size = Pt(13)
p8_lh.font.bold = True
p8_lh.font.color.rgb = COLOR_CRIMSON
p8_lh.space_after = Pt(6)

p8_l1 = tf8_l.add_paragraph()
p8_l1.text = "• Memuat status berjalan: pending_dp, confirmed, active.\n• Dilengkapi hitung mundur pengembalian alat.\n• Menampilkan sisa tagihan yang harus dilunasi di toko."
p8_l1.font.size = Pt(11)
p8_l1.font.color.rgb = COLOR_SLATE_700

img8_path = os.path.join(IMG_DIR, "08_sewa_saya_aktif.png")
if os.path.exists(img8_path):
    slide8.shapes.add_picture(img8_path, Inches(1.0), Inches(3.2), width=Inches(5.3))

# Right Column: Riwayat Lampau
add_card(slide8, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.6))
tb8_r = slide8.shapes.add_textbox(Inches(7.0), Inches(1.5), Inches(5.3), Inches(2.2))
tf8_r = tb8_r.text_frame
tf8_r.word_wrap = True
p8_rh = tf8_r.paragraphs[0]
p8_rh.text = "2. TAB 'RIWAYAT TRANSAKSI' (ARSIP)"
p8_rh.font.size = Pt(13)
p8_rh.font.bold = True
p8_rh.font.color.rgb = COLOR_SLATE_900
p8_rh.space_after = Pt(6)

p8_r1 = tf8_r.add_paragraph()
p8_r1.text = "• Arsip pesanan masa lalu: returned (selesai) & cancelled.\n• Bukti pelunasan 100% dan status jaminan KTP kembali.\n• Tombol cetak ulang nota digital untuk bukti reimbursement."
p8_r1.font.size = Pt(11)
p8_r1.font.color.rgb = COLOR_SLATE_700

img9_path = os.path.join(IMG_DIR, "09_riwayat_transaksi_lampau.png")
if os.path.exists(img9_path):
    slide8.shapes.add_picture(img9_path, Inches(7.0), Inches(3.2), width=Inches(5.3))

set_speaker_notes(slide8, 
    "Dalam PRD v2.1, kami memisahkan navigasi menjadi dua halaman berbeda untuk menciptakan antarmuka yang bersih. "
    "Tab 'Sewa Saya' khusus memuat transaksi aktif yang membutuhkan perhatian: apakah DP belum dibayar, berapa sisa tagihan di toko, dan berapa hari lagi batas pengembalian tenda. "
    "Sementara tab 'Riwayat Transaksi' adalah arsip permanen untuk transaksi yang sudah selesai atau dikembalikan, lengkap dengan fitur cetak nota digital untuk keperluan reimbursement komunitas."
)

# ==========================================
# SLIDE 9: PUSAT KENDALI OWNER & RESET OMSET
# ==========================================
create_standard_slide(
    9,
    "Pusat Kendali Owner: Dasbor Eksekutif & Fitur Reset Omset",
    "Executive Control & Go-Live Readiness",
    [
        "Metrik Finansial Realtime: Total Akumulasi Omset, Kas Masuk DP, Sisa Tagihan Lapangan, dan Rasio Utilisasi Alat (%).",
        "Tombol 'Simpan Foto Galeri': Menyimpan permanen konfigurasi foto UGC komunitas langsung ke file server produksi.",
        "Fitur Khusus 'Reset Omset & Riwayat': Tombol pembersihan aman dengan konfirmasi ganda untuk mereset data uji coba menjadi Rp 0.",
        "Pemulihan Status Alat Otomatis: Merestorasi status seluruh tenda dan carrier kembali ke status 'available' di rak toko saat toko resmi dibuka."
    ],
    "Sebagai owner bisnis, Rifki dapat memantau detak jantung usaha dari Dasbor Eksekutif ini. Di bagian atas, tersaji kartu metrik realtime: omset kumulatif, kas DP yang sudah masuk ke rekening, sisa piutang di toko, hingga rasio utilisasi alat. Dan yang sangat penting: kami melengkapi dasbor ini dengan tombol 'Reset Omset & Riwayat'. Fitur ini memungkinkan owner membersihkan seluruh transaksi uji coba menjadi Rp 0 dan mengembalikan semua alat ke rak toko dengan satu sentuhan aman saat sistem siap go-live.",
    "10_dasbor_eksekutif_admin.png"
)

# ==========================================
# SLIDE 10: ANALISIS KEUANGAN & EKSPOR EXCEL
# ==========================================
create_standard_slide(
    10,
    "Analisis Bisnis & CRM Pendaki: Laporan Finansial & Ekspor Data",
    "Business Intelligence & Export",
    [
        "Grafik Omset Bulanan: Mengetahui puncak musim pendakian (musim kemarau & libur panjang) untuk mengantisipasi belanja unit tambahan.",
        "CRM Top Renters: Mengidentifikasi profil pendaki paling aktif beserta nilai sewa mereka untuk program loyalitas dan diskon VIP.",
        "1-Click Export CSV/Excel: Mengunduh data lengkap rekapitulasi transaksi untuk keperluan audit, pajak, dan software akuntansi eksternal.",
        "Transparansi Kas: Rekonsiliasi instan antara kas DP via QRIS dan pelunasan fisik di toko."
    ],
    "Pengambilan keputusan bisnis yang cerdas didasarkan pada data. Di modul Laporan Keuangan, TRIVA menyajikan grafik tren pendapatan musiman dan fitur CRM Top Renters untuk mengapresiasi pelanggan setia. Untuk kebutuhan audit atau integrasi ke software akuntansi eksternal, admin cukup menekan tombol 'Ekspor ke Excel' untuk mengunduh seluruh rekap transaksi dalam hitungan detik.",
    "11_laporan_keuangan_ekspor_excel.png"
)

# ==========================================
# SLIDE 11: PROGRESSIVE WEB APP (PWA) MOBILE
# ==========================================
create_standard_slide(
    11,
    "Pengalaman Native di Genggaman: Progressive Web App (PWA)",
    "Mobile PWA & Accessibility",
    [
        "Instalasi Cepat di Ponsel: Banner pintar '📲 Install Aplikasi TRIVA' otomatis muncul di browser Android (Chrome) dan iOS (Safari).",
        "Mode Standalone Layar Penuh: Berjalan tanpa bilah URL browser, memberikan tampilan dan kenyamanan setara aplikasi native.",
        "Ukuran Sangat Ringan: Memakan kapasitas penyimpanan kurang dari 5MB (sangat hemat dibanding aplikasi Android biasa 60MB-100MB).",
        "Otomasi Sinkronisasi Versi: Aplikasi di ponsel pengguna selalu otomatis ter-update setiap kali server melakukan pembaruan kode baru."
    ],
    "Apakah pelanggan harus repot mendownload file APK besar di Play Store? Sama sekali tidak! TRIVA dibangun dengan standar Progressive Web App modern. Ketika pelanggan membuka website kami dari ponsel Android atau iPhone, banner 'Install Aplikasi TRIVA' langsung muncul. Pengguna cukup mengklik install, dan ikon TRIVA akan terpasang di homescreen ponsel mereka. Aplikasi terbuka instan, tampil fullscreen tanpa address bar browser, sangat ringan di bawah 5MB, dan selalu otomatis ter-update setiap kali ada pembaruan fitur.",
    "12_mobile_pwa_install_banner.png"
)

# ==========================================
# SLIDE 12: ARSITEKTUR TEKNOLOGI & RBAC
# ==========================================
slide12 = prs.slides.add_slide(blank_slide_layout)
add_header(slide12, 12, "Arsitektur Sistem & Matriks Hak Akses (RBAC)", "Enterprise Architecture & Security")

# Left Column: Tech Stack Cards
add_card(slide12, Inches(0.8), Inches(1.4), Inches(4.5), Inches(5.6))
tb12_l = slide12.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(4.1), Inches(5.3))
tf12_l = tb12_l.text_frame
tf12_l.word_wrap = True

p_tech_h = tf12_l.paragraphs[0]
p_tech_h.text = "TEKNOLOGI UTAMA (TECH STACK)"
p_tech_h.font.size = Pt(13)
p_tech_h.font.bold = True
p_tech_h.font.color.rgb = COLOR_CRIMSON
p_tech_h.space_after = Pt(10)

stacks = [
    ("Frontend Core", "Next.js 15.5 (App Router) + React 19 + TypeScript"),
    ("Styling & UI", "Tailwind CSS 3.4 + Lucide React Icons"),
    ("Database Cloud", "Supabase PostgreSQL 15 + Realtime Sync Channels"),
    ("Client Engine", "HTML5 Canvas Compressor + IndexedDB Local Storage"),
    ("Cloud Hosting", "Vercel Global Edge Serverless Production")
]

for sname, sval in stacks:
    p_sn = tf12_l.add_paragraph()
    p_sn.text = f"• {sname}:"
    p_sn.font.bold = True
    p_sn.font.size = Pt(11.5)
    p_sn.font.color.rgb = COLOR_SLATE_900
    p_sv = tf12_l.add_paragraph()
    p_sv.text = f"  {sval}"
    p_sv.font.size = Pt(10.5)
    p_sv.font.color.rgb = COLOR_SLATE_700
    p_sv.space_after = Pt(6)

# Right Column: RBAC Matrix Cards
add_card(slide12, Inches(5.6), Inches(1.4), Inches(6.9), Inches(5.6), bg_color=COLOR_WHITE)
tb12_r = slide12.shapes.add_textbox(Inches(5.8), Inches(1.5), Inches(6.5), Inches(5.3))
tf12_r = tb12_r.text_frame
tf12_r.word_wrap = True

p_rbac_h = tf12_r.paragraphs[0]
p_rbac_h.text = "MATRIKS HAK AKSES PERAN (RBAC)"
p_rbac_h.font.size = Pt(13)
p_rbac_h.font.bold = True
p_rbac_h.font.color.rgb = COLOR_SLATE_900
p_rbac_h.space_after = Pt(10)

roles_data = [
    ("GUEST (PUBLIK)", "Jelajah katalog, carousel 3D, chat WhatsApp CS, dan melihat galeri pendaki.", COLOR_SLATE_500),
    ("CUSTOMER (PENYEWA)", "Membuat pesanan sewa baru, bayar DP 30% via QRIS, pantau sewa aktif, unduh nota.", COLOR_SLATE_700),
    ("STAFF OPERASIONAL", "Pemeriksaan fisik alat, verifikasi KTP di brankas, terima pelunasan toko, serah terima alat.", COLOR_SLATE_900),
    ("ADMIN / OWNER (RIFKI)", "Kontrol penuh master inventaris, ganti foto galeri, laporan keuangan, dan reset omset.", COLOR_CRIMSON)
]

for rname, rdesc, rcol in roles_data:
    p_rn = tf12_r.add_paragraph()
    p_rn.text = f"🔹 {rname}"
    p_rn.font.bold = True
    p_rn.font.size = Pt(11.5)
    p_rn.font.color.rgb = rcol
    p_rd = tf12_r.add_paragraph()
    p_rd.text = rdesc
    p_rd.font.size = Pt(10.5)
    p_rd.font.color.rgb = COLOR_SLATE_700
    p_rd.space_after = Pt(8)

set_speaker_notes(slide12, 
    "Di balik antarmuka yang elegan, TRIVA ditenagai teknologi kelas industri: Next.js 15 dengan server-side rendering tercepat, dipadukan dengan Supabase PostgreSQL untuk sinkronisasi data realtime. "
    "Kami menerapkan Role-Based Access Control ketat: tamu umum hanya bisa menjelajah, customer dapat memesan dan membayar DP, staf toko menangani serah terima KTP di kasir, dan hak eksklusif admin mencakup manajemen inventaris serta kendali finansial penuh."
)

# ==========================================
# SLIDE 13: ROADMAP STRATEGIS PENGEMBANGAN
# ==========================================
slide13 = prs.slides.add_slide(blank_slide_layout)
add_header(slide13, 13, "Rencana Strategis & Roadmap Pengembangan", "Future Product Roadmap")

quarters = [
    ("Q1", "GO-LIVE & KOMUNITAS", [
        "Peluncuran resmi toko offline.",
        "Integrasi pembayaran QRIS live.",
        "Kemitraan komunitas pendaki gunung."
    ], COLOR_CRIMSON),
    ("Q2", "IOT & SMART SCANNING", [
        "Label QR Code fisik tahan air di tiap tenda.",
        "Scan cepat serah-terima alat via kamera HP.",
        "Pencatatan riwayat servis per unit."
    ], COLOR_SLATE_900),
    ("Q3", "MULTI-BASECAMP & BOT", [
        "Sistem multi-outlet (cabang basecamp gunung).",
        "Otomasi WhatsApp Bot pengingat masa sewa.",
        "Sinkronisasi stok antar cabang."
    ], COLOR_SLATE_700),
    ("Q4", "ASURANSI PENDAKI", [
        "Integrasi asuransi mikro perlindungan pendaki.",
        "Skema klaim kerusakan alat sewa otomatis.",
        "Program loyalitas poin reward pendaki."
    ], COLOR_GREEN)
]

for idx, (qtag, qtitle, qitems, qcol) in enumerate(quarters):
    x = Inches(0.8 + idx * 3.0)
    add_card(slide13, x, Inches(1.5), Inches(2.8), Inches(5.4), bg_color=COLOR_WHITE)
    
    badge = slide13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.2), Inches(1.7), Inches(2.4), Inches(0.6))
    badge.fill.solid()
    badge.fill.fore_color.rgb = qcol
    badge.line.fill.background()
    p_qb = badge.text_frame.paragraphs[0]
    p_qb.text = qtag
    p_qb.font.size = Pt(14)
    p_qb.font.bold = True
    p_qb.font.color.rgb = COLOR_WHITE
    p_qb.alignment = PP_ALIGN.CENTER
    
    tb_q = slide13.shapes.add_textbox(x + Inches(0.15), Inches(2.5), Inches(2.5), Inches(4.2))
    tf_q = tb_q.text_frame
    tf_q.word_wrap = True
    
    p_qt = tf_q.paragraphs[0]
    p_qt.text = qtitle
    p_qt.font.size = Pt(12)
    p_qt.font.bold = True
    p_qt.font.color.rgb = COLOR_SLATE_900
    p_qt.space_after = Pt(10)
    
    for item in qitems:
        p_qi = tf_q.add_paragraph()
        p_qi.text = f"• {item}"
        p_qi.font.size = Pt(11)
        p_qi.font.color.rgb = COLOR_SLATE_700
        p_qi.space_after = Pt(8)

set_speaker_notes(slide13, 
    "Kami tidak berhenti di sini. Roadmap pengembangan TRIVA ke depan telah disiapkan secara matang. "
    "Pada kuartal berikutnya, kami akan menambahkan sistem label QR Code fisik pada tiap tenda agar staf cukup mengarahkan kamera HP saat barang dikembalikan. "
    "Selanjutnya, kami berencana memperluas arsitektur ke sistem multi-cabang basecamp dan menghadirkan perlindungan asuransi mikro pendakian langsung di dalam paket sewa."
)

# ==========================================
# SLIDE 14: KESIMPULAN & SESI TANYA JAWAB (Q&A)
# ==========================================
slide14 = prs.slides.add_slide(blank_slide_layout)
add_header(slide14, 14, "Kesimpulan & Sesi Tanya Jawab (Q&A)", "Summary & Open Discussion")

# Left Column
add_card(slide14, Inches(0.8), Inches(1.4), Inches(6.0), Inches(5.6))
tb14 = slide14.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(5.6), Inches(5.3))
tf14 = tb14.text_frame
tf14.word_wrap = True

p14_h = tf14.paragraphs[0]
p14_h.text = "4 PILAR KEUNGGULAN TRIVA OUTDOOR"
p14_h.font.size = Pt(13)
p14_h.font.bold = True
p14_h.font.color.rgb = COLOR_CRIMSON
p14_h.space_after = Pt(12)

pillars = [
    ("🛡️ AMAN", "SOP Serah Terima & Brankas KTP fisik menghilangkan risiko unit hilang."),
    ("💳 FLEKSIBEL", "Uang muka minimal 30% via QRIS memberi kemudahan finansial pendaki."),
    ("📲 PRAKTIS", "Aplikasi Mobile PWA terinstal langsung di HP tanpa unduh APK besar."),
    ("📊 TERUKUR", "Dasbor eksekutif realtime dan fitur reset omset untuk kemudahan go-live.")
]

for pname, pdesc in pillars:
    p = tf14.add_paragraph()
    p.text = f"{pname}: {pdesc}"
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_SLATE_700
    p.space_after = Pt(10)

p_open = tf14.add_paragraph()
p_open.text = "💬 Sesi Tanya Jawab (Q&A) & Live Demo Dibuka!"
p_open.font.size = Pt(13)
p_open.font.bold = True
p_open.font.color.rgb = COLOR_CRIMSON
p_open.space_after = Pt(4)

p_cs = tf14.add_paragraph()
p_cs.text = "Hotline CS Resmi: 083851284143 (+62 838-5128-4143)"
p_cs.font.size = Pt(11)
p_cs.font.color.rgb = COLOR_SLATE_500

# Right Hero Image
add_card(slide14, Inches(7.1), Inches(1.4), Inches(5.5), Inches(5.6), bg_color=COLOR_WHITE)
if os.path.exists(img1_path):
    slide14.shapes.add_picture(img1_path, Inches(7.25), Inches(1.55), width=Inches(5.2))

set_speaker_notes(slide14, 
    "Demikian presentasi tentang aplikasi TRIVA Outdoor Rental: Style on the Trail. "
    "TRIVA membuktikan bahwa teknologi dapat mengubah operasional persewaan outdoor yang dulunya rawan dan manual menjadi sebuah ekosistem digital yang aman, menguntungkan, dan membanggakan bagi komunitas pendaki. "
    "Terima kasih banyak atas perhatian dan waktu Bapak/Ibu sekalian. Sekarang, saya dengan senang hati membuka sesi tanya jawab atau demonstrasi langsung."
)

out_pptx = r"C:\Users\Admin\.gemini\antigravity\scratch\triva-outdoor-rental\TRIVA_OUTDOOR_RENTAL_PRESENTATION.pptx"
prs.save(out_pptx)
print("PPTX presentation successfully created at:", out_pptx)
