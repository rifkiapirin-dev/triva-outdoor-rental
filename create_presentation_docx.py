import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

doc = Document()

# Set standard margins (1 inch)
for section in doc.sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.9)

IMG_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\0a1b8e86-587f-43b3-81d4-131d42bdadd4"

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def add_header_banner(title, subtitle):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("PANDUAN & MATERI PRESENTASI APLIKASI")
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(133, 25, 25) # #851919 Crimson

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = p2.add_run(title)
    run2.font.name = "Calibri"
    run2.font.size = Pt(22)
    run2.font.bold = True
    run2.font.color.rgb = RGBColor(15, 23, 42) # Slate 900

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run3 = p3.add_run(subtitle)
    run3.font.name = "Calibri"
    run3.font.size = Pt(12)
    run3.font.italic = True
    run3.font.color.rgb = RGBColor(71, 85, 105)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Diselaraskan dengan Product Requirement Document (PRD) v2.1 | TRIVA Outdoor")
    r_meta.font.size = Pt(9.5)
    r_meta.font.color.rgb = RGBColor(100, 116, 139)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

def add_slide_section(slide_no, title, img_filename, objective, key_points, talking_script):
    # Slide Title
    h = doc.add_heading(level=1)
    r_badge = h.add_run(f"SLIDE {slide_no:02d}: ")
    r_badge.font.name = "Calibri"
    r_badge.font.size = Pt(15)
    r_badge.font.bold = True
    r_badge.font.color.rgb = RGBColor(133, 25, 25) # Crimson

    r_title = h.add_run(title)
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(15)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)
    
    # Image if exists
    if img_filename:
        img_path = os.path.join(IMG_DIR, img_filename)
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(6)
            p_img.paragraph_format.space_after = Pt(4)
            run_img = p_img.add_run()
            run_img.add_picture(img_path, width=Inches(5.5))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(10)
            r_cap = p_cap.add_run(f"Gambar: Tampilan Antarmuka Aplikasi TRIVA ({img_filename})")
            r_cap.font.size = Pt(9)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(100, 116, 139)

    # Objective Box
    t_obj = doc.add_table(rows=1, cols=1)
    t_obj.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_obj = t_obj.cell(0, 0)
    set_cell_background(cell_obj, "F8FAFC")
    p_ob = cell_obj.paragraphs[0]
    p_ob.paragraph_format.space_before = Pt(4)
    p_ob.paragraph_format.space_after = Pt(4)
    r_ob_label = p_ob.add_run("🎯 Tujuan Slide: ")
    r_ob_label.bold = True
    r_ob_label.font.size = Pt(10)
    r_ob_label.font.color.rgb = RGBColor(30, 41, 59)
    r_ob_val = p_ob.add_run(objective)
    r_ob_val.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Key Points
    p_kp = doc.add_paragraph()
    r_kp_h = p_kp.add_run("Poin Kunci & Spesifikasi Fitur:")
    r_kp_h.bold = True
    r_kp_h.font.size = Pt(11)
    r_kp_h.font.color.rgb = RGBColor(15, 23, 42)
    p_kp.paragraph_format.space_after = Pt(2)

    for pt in key_points:
        p_item = doc.add_paragraph(style='List Bullet')
        p_item.paragraph_format.space_after = Pt(2)
        r_item = p_item.add_run(pt)
        r_item.font.size = Pt(10)

    # Talking Script (Callout table)
    t_script = doc.add_table(rows=1, cols=1)
    t_script.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_sc = t_script.cell(0, 0)
    set_cell_background(cell_sc, "FFF1F2") # Light crimson tint
    p_sc = cell_sc.paragraphs[0]
    p_sc.paragraph_format.space_before = Pt(6)
    p_sc.paragraph_format.space_after = Pt(6)
    
    r_sc_head = p_sc.add_run("🎙️ Naskah Presenter (Apa yang Diucapkan):\n")
    r_sc_head.bold = True
    r_sc_head.font.size = Pt(10)
    r_sc_head.font.color.rgb = RGBColor(159, 18, 57) # Crimson dark
    
    r_sc_body = p_sc.add_run(f'"{talking_script}"')
    r_sc_body.italic = True
    r_sc_body.font.size = Pt(10)
    r_sc_body.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

# Generate Title
add_header_banner(
    "TRIVA OUTDOOR RENTAL — STYLE ON THE TRAIL",
    "Modernisasi Bisnis Persewaan Alat Outdoor Berbasis SaaS & Mobile PWA"
)

# Slide 1
add_slide_section(
    1,
    "Pembuka & Brand Identity 'Style on the Trail'",
    "01_hero_showcase.png",
    "Membuka presentasi, mengenalkan identitas brand premium, dan memposisikan TRIVA sebagai solusi gaya hidup petualangan.",
    [
        "Tagline 'Style on the Trail': Mengangkat citra sewa alat outdoor dari sekadar fungsi menjadi gaya hidup prestisius.",
        "Palet Warna Identitas: Crimson Mountain (#851919) dipadukan dengan aksen gelap modern (Slate Dark #0f172a).",
        "Hero Section Interaktif: Showcase 3D Jacket Crimson Hardshell dengan transparansi harga harian."
    ],
    "Selamat pagi / siang rekan-rekan dan bapak/ibu sekalian. Hari ini saya bangga mempersembahkan TRIVA Outdoor Rental dengan tagline 'Style on the Trail'. Di era di mana aktivitas mendaki gunung telah menjadi bagian dari gaya hidup generasi muda, bisnis persewaan outdoor membutuhkan transformasi digital yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang estetik, cepat, dan terpercaya. Inilah alasan mengapa kami membangun TRIVA Outdoor Rental."
)

# Slide 2
add_slide_section(
    2,
    "Latar Belakang: 4 Masalah Klasik Rental Outdoor & Solusi TRIVA",
    "02_kategori_outdoor.png",
    "Menyampaikan rasa urgensi (pain points) bisnis rental konvensional dan mendemonstrasikan solusi TRIVA.",
    [
        "Masalah 1 - Risiko Kehilangan & Kerusakan: Ketiadaan standardisasi jaminan fisik (KTP asli) dan pencatatan kondisi barang.",
        "Masalah 2 - Pembukuan Kas Amburadul: Uang muka (DP), sisa pelunasan di toko, dan denda sering bercampur di buku manual.",
        "Masalah 3 - Pemesanan Tidak Realtime: Pelanggan harus chat berulang kali hanya untuk memastikan stok tenda.",
        "Masalah 4 - Branding Usang: Tampilan toko konvensional kurang membangun kepercayaan pendaki.",
        "Solusi TRIVA: Katalog terstruktur dengan kode unik unit, booking DP 30%, brankas KTP fisik, dan dasbor eksekutif."
    ],
    "Bapak/Ibu sekalian, bisnis sewa alat outdoor konvensional memiliki kerentanan besar: alat hilang karena jaminan tidak tertib, kas DP dan pelunasan toko tercecer di buku tulis, serta calon pendaki yang kecewa karena alat habis saat tiba di basecamp. TRIVA Outdoor Rental memecahkan seluruh masalah ini. Melalui katalog kategori terstruktur yang Anda lihat di layar—mulai dari Tenda Dome, Carrier Ergonomis, hingga Peralatan Memasak—semua unit terdata secara realtime sehingga pelanggan tahu persis ketersediaan alat sebelum menyewa."
)

# Slide 3
add_slide_section(
    3,
    "Social Proof & Komunitas: Galeri #StyleOnTheTrail (UGC Nyata)",
    "03_galeri_komunitas_styleonthetrail.png",
    "Membuktikan kepercayaan pendaki melalui foto petualangan asli dan fitur ganti foto anti-reset khusus Admin.",
    [
        "Dokumentasi Pendakian Nyata: Foto pendaki asli di Puncak Gede (2.958 MDPL), Gunung Sagara (2.132 MDPL), Hutan Mati Papandayan, dan Prau.",
        "Role-Based Access Control (RBAC): Tombol 'Ganti Foto' eksklusif untuk Admin; customer umum hanya dapat melihat & like.",
        "Teknologi Kompresi Anti-Reset: Mengompres foto kamera ponsel (5MB-10MB) via Canvas menjadi ~90KB ramah memori.",
        "Penyimpanan Berlapis: IndexedDB + LocalStorage + Server sync, menjamin foto tidak pernah hilang saat halaman di-refresh."
    ],
    "Kepercayaan pelanggan outdoor dibangun lewat bukti nyata di lapangan. Pada layar ini, kita melihat Galeri Komunitas #StyleOnTheTrail yang menampilkan foto-foto pendaki asli menggunakan perlengkapan kami di Puncak Gede, Gunung Sagara, dan Hutan Mati Papandayan. Khusus untuk pemilik toko, sistem menyediakan fitur ganti foto interaktif dengan teknologi kompresi otomatis client-side. Gambar dikompresi seketika agar hemat penyimpanan dan diproteksi dengan penyimpanan berlapis sehingga galeri tetap permanen dan tidak pernah kembali ke bawaan saat halaman diperbarui."
)

# Slide 4
add_slide_section(
    4,
    "Layanan Pelanggan Instan: Floating WhatsApp CS (083851284143)",
    "04_floating_whatsapp_widget.png",
    "Menunjukkan kemudahan jalur komunikasi langsung dengan nomor admin resmi.",
    [
        "Nomor Hotline Terverifikasi: Terhubung langsung ke WhatsApp Admin di 083851284143 (+62 838-5128-4143).",
        "Desain Ergonomis Mobile: Terpasang di posisi 'bottom-20 right-4' di ponsel agar tidak menutupi tab bar bawah.",
        "Quick Chips Respons Cepat: Tombol instan untuk konfirmasi DP, kendala serah terima alat, atau booking khusus.",
        "Format Pesan Otomatis: Membuat template pesan WhatsApp rapi dan terstruktur secara instan."
    ],
    "Kami memahami bahwa pendaki sering membutuhkan konsultasi cepat sebelum berangkat: apakah tenda ini tahan badai? Bagaimana cara konfirmasi DP? Untuk itu, TRIVA menyematkan Floating WhatsApp Widget di seluruh halaman. Dilengkapi tombol opsi instan atau Quick Chips, pengguna cukup satu kali klik untuk membuka obrolan langsung ke WhatsApp Admin di 083851284143 dengan pesan yang sudah terformat rapi. Posisi tombol juga telah dioptimasi secara ergonomis agar nyaman dioperasikan satu tangan pada perangkat ponsel."
)

# Slide 5
add_slide_section(
    5,
    "Manajemen Inventaris Cerdas: Kodefikasi Unit & Status Realtime",
    "05_katalog_inventaris_unit.png",
    "Menjelaskan kontrol inventaris tingkat unit untuk mencegah overbooking dan memastikan kesiapan alat.",
    [
        "Kode Unit Unik: TND-01 (Tenda Dome Borneo 4P), CR-01 (Carrier Rhinos 60L), SPT-02 (Sepatu Vibram).",
        "Status 3 Fase: 'available' (hijau/tersedia), 'rented' (biru/sedang di gunung), 'maintenance' (kuning/servis cuci).",
        "Pencarian & Filter Cepat: Memudahkan staf dan pelanggan memfilter alat berdasarkan kategori dan ketersediaan."
    ],
    "Salah satu kesalahan fatal pada rental tradisional adalah overbooking—dua pelanggan menyewa tenda yang sama di tanggal yang sama. Di TRIVA, setiap alat memiliki kode unit unik, seperti TND-01 atau CR-01. Sistem inventaris kami membagi status menjadi tiga kondisi jelas: Tersedia, Sedang Disewa, atau Perawatan. Admin dapat memantau secara presisi unit mana yang sedang berada di atas gunung dan unit mana yang sudah siap di rak toko."
)

# Slide 6
add_slide_section(
    6,
    "Alur Pemesanan Fleksibel: Minimal DP 30% & QRIS Instan",
    "06_modal_booking_dp_30persen.png",
    "Menunjukkan fleksibilitas modal booking yang menurunkan beban pengeluaran awal pendaki.",
    [
        "Kalkulasi Otomatis: Total Biaya = Harga per Hari x Durasi Hari x Jumlah Unit.",
        "Uang Muka Minimal 30%: Menjamin komitmen sewa tanpa membebani pelanggan membayar penuh di awal.",
        "QRIS Gateway Instan: Pembayaran DP mudah dengan scan QRIS langsung dari aplikasi m-banking atau e-wallet.",
        "Transparansi Sisa Tagihan: Sistem secara transparan menampilkan sisa pembayaran yang akan dilunasi di toko."
    ],
    "TRIVA memberikan fleksibilitas pembayaran yang sangat disukai para petualang. Alih-alih mewajibkan bayar lunas 100% di muka, sistem kami secara otomatis menghitung Down Payment minimal 30%. Seperti yang terlihat pada modal booking di layar: untuk total sewa Rp 150.000 selama 3 hari, penyewa cukup membayar DP Rp 45.000 via QRIS untuk mengamankan unit. Sisa Rp 105.000 baru akan dilunasi saat mereka mengambil barang di toko."
)

# Slide 7
add_slide_section(
    7,
    "Prosedur Operasional Toko: Serah Terima & Brankas Jaminan KTP",
    None,
    "Menguraikan alur verifikasi fisik dan pelunasan toko (Handover Settlement) yang aman.",
    [
        "Verifikasi Identitas Fisik: Staf toko mencocokkan wajah penyewa dengan identitas KTP/SIM asli.",
        "Inspeksi Fisik Bersama: Pengecekan kondisi frame tenda, resleting tas, dan kelengkapan kompor.",
        "Penyimpanan Jaminan: KTP asli dimasukkan ke brankas keamanan toko TRIVA.",
        "Pelunasan Sisa Biaya: Sisa tagihan dibayar tunai atau QRIS toko di meja kasir sebelum barang diserahkan.",
        "Aktivasi Status: Status transaksi berubah menjadi 'active' (Sedang Disewa)."
    ],
    "Bagaimana TRIVA melindungi aset alat dari risiko hilang? Jawabannya ada pada SOP Handover Settlement. Saat pendaki datang ke toko kami, staf akan memvalidasi fisik KTP asli dan menyimpannya di brankas jaminan. Pada saat bersamaan, sisa tagihan sewa dilunasi di meja kasir baik dengan uang tunai maupun scan QRIS toko. Setelah semua klir, staf menekan tombol 'Selesaikan Serah Terima' dan status alat berpindah menjadi Active. Ini adalah standar keamanan berlapis yang sangat solid."
)

# Slide 8
add_slide_section(
    8,
    "Navigasi Terstruktur: 'Sewa Saya' (Aktif) vs 'Riwayat Transaksi' (Arsip)",
    "08_sewa_saya_aktif.png",
    "Mendemonstrasikan pemisahan antarmuka antara transaksi yang membutuhkan aksi vs arsip lampau.",
    [
        "Menu 'Sewa Saya': Menampilkan transaksi aktif (pending_dp, confirmed, active) dengan hitung mundur pengembalian.",
        "Rincian Pelunasan Toko: Mengingatkan penyewa jumlah sisa tagihan yang harus dibayar saat serah terima barang.",
        "Menu 'Riwayat Transaksi': Arsip pesanan selesai (returned/cancelled) dengan kemampuan unduh/cetak ulang nota digital."
    ],
    "Dalam PRD v2.1, kami memisahkan navigasi menjadi dua halaman berbeda untuk menciptakan antarmuka yang bersih. Tab 'Sewa Saya' khusus memuat transaksi aktif yang membutuhkan perhatian: apakah DP belum dibayar, berapa sisa tagihan di toko, dan berapa hari lagi batas pengembalian tenda. Sementara tab 'Riwayat Transaksi' adalah arsip permanen untuk transaksi yang sudah selesai atau dikembalikan, lengkap dengan fitur cetak nota digital untuk keperluan reimbursement komunitas."
)

# Slide 9
add_slide_section(
    9,
    "Pusat Kendali Owner: Dasbor Eksekutif & Fitur Reset Omset",
    "10_dasbor_eksekutif_admin.png",
    "Menampilkan metrik bisnis penting bagi pengambil keputusan dan fitur persiapan Go-Live.",
    [
        "Metrik Finansial Realtime: Total Akumulasi Omset, Kas DP Diterima, Sisa Tagihan Lapangan, dan Utilisasi Alat.",
        "Tombol 'Simpan Foto Galeri': Menyinkronkan pembaruan foto komunitas ke file server produksi.",
        "Tombol Khusus 'Reset Omset & Riwayat': Mereset data transaksi demo menjadi Rp 0 dan mengembalikan alat ke rak saat siap peluncuran."
    ],
    "Sebagai owner bisnis, Rifki dapat memantau detak jantung usaha dari Dasbor Eksekutif ini. Di bagian atas, tersaji kartu metrik realtime: omset kumulatif, kas DP yang sudah masuk ke rekening, sisa piutang di toko, hingga rasio utilisasi alat. Dan yang sangat penting: kami melengkapi dasbor ini dengan tombol 'Reset Omset & Riwayat'. Fitur ini memungkinkan owner membersihkan seluruh transaksi uji coba menjadi Rp 0 dan mengembalikan semua alat ke rak toko dengan satu sentuhan aman saat sistem siap go-live."
)

# Slide 10
add_slide_section(
    10,
    "Analisis Bisnis & CRM Pendaki: Laporan Finansial & Ekspor Excel",
    "11_laporan_keuangan_ekspor_excel.png",
    "Menyajikan analitik pertumbuhan omset dan loyalitas penyewa untuk perencanaan bisnis.",
    [
        "Grafik Omset Bulanan: Memetakan musim pendakian puncak (libur panjang, kemarau) untuk antisipasi penambahan stok.",
        "CRM Top Renters: Mengidentifikasi pendaki paling loyal untuk program diskon khusus dan retensi.",
        "Ekspor Excel 1-Klik: Mengunduh data audit pembukuan rapi yang siap dilaporkan ke akuntan."
    ],
    "Pengambilan keputusan bisnis yang cerdas didasarkan pada data. Di modul Laporan Keuangan, TRIVA menyajikan grafik tren pendapatan musiman dan fitur CRM Top Renters untuk mengapresiasi pelanggan setia. Untuk kebutuhan audit atau integrasi ke software akuntansi eksternal, admin cukup menekan tombol 'Ekspor ke Excel' untuk mengunduh seluruh rekap transaksi dalam hitungan detik."
)

# Slide 11
add_slide_section(
    11,
    "Pengalaman Native di Genggaman: Progressive Web App (PWA)",
    "12_mobile_pwa_install_banner.png",
    "Membuktikan kemudahan aksesibilitas smartphone tanpa hambatan app store.",
    [
        "Instalasi Instan: Banner '📲 Install Aplikasi TRIVA' otomatis muncul di browser Chrome/Safari.",
        "Tampilan Standalone Fullscreen: Berjalan layaknya aplikasi native tanpa address bar.",
        "Kapasitas Sangat Ringan: Ukuran di bawah 5MB, jauh lebih hemat kuota dan memori dibanding APK 100MB.",
        "Pembaruan Otomatis: Versi aplikasi selalu terbaru secara realtime tanpa perlu update manual di app store."
    ],
    "Apakah pelanggan harus repot mendownload file APK besar di Play Store? Sama sekali tidak! TRIVA dibangun dengan standar Progressive Web App modern. Ketika pelanggan membuka website kami dari ponsel Android atau iPhone, banner 'Install Aplikasi TRIVA' langsung muncul. Pengguna cukup mengklik install, dan ikon TRIVA akan terpasang di homescreen ponsel mereka. Aplikasi terbuka instan, tampil fullscreen tanpa address bar browser, sangat ringan di bawah 5MB, dan selalu otomatis ter-update setiap kali ada pembaruan fitur."
)

# Slide 12
add_slide_section(
    12,
    "Arsitektur Sistem, Keamanan Data & Hak Akses (RBAC)",
    None,
    "Menjelaskan fondasi teknologi modern dan keamanan data berlapis.",
    [
        "Frontend Modern: Next.js 15.5 App Router, React 19, Tailwind CSS 3.4.",
        "Backend & Database: Supabase Cloud PostgreSQL dengan enkripsi Auth dan Realtime Sync.",
        "Role-Based Access Control (RBAC): Matriks hak akses terpisah untuk Guest, Customer, Staff, dan Owner.",
        "Hosting & Kecepatan: Vercel Production Serverless dengan waktu respon di bawah 200ms."
    ],
    "Di balik antarmuka yang elegan, TRIVA ditenagai teknologi kelas industri: Next.js 15 dengan server-side rendering tercepat, dipadukan dengan Supabase PostgreSQL untuk sinkronisasi data realtime. Kami menerapkan Role-Based Access Control ketat: tamu umum hanya bisa menjelajah, customer dapat memesan dan membayar DP, staf toko menangani serah terima KTP di kasir, dan hak eksklusif admin mencakup manajemen inventaris serta kendali finansial penuh."
)

# Slide 13
add_slide_section(
    13,
    "Rencana Strategis & Roadmap Pengembangan",
    None,
    "Memaparkan visi masa depan dan keberlanjutan produk TRIVA.",
    [
        "Q1: Peluncuran resmi toko offline dan program kemitraan komunitas pencinta alam.",
        "Q2: Integrasi label QR Code fisik tahan air pada tiap unit alat untuk scan cepat di kasir.",
        "Q3: Sistem multi-cabang basecamp dan WhatsApp Bot otomatis untuk pengingat masa sewa.",
        "Q4: Integrasi asuransi mikro pendakian untuk proteksi keselamatan pendaki dan kerusakan alat."
    ],
    "Kami tidak berhenti di sini. Roadmap pengembangan TRIVA ke depan telah disiapkan secara matang. Pada kuartal berikutnya, kami akan menambahkan sistem label QR Code fisik pada tiap tenda agar staf cukup mengarahkan kamera HP saat barang dikembalikan. Selanjutnya, kami berencana memperluas arsitektur ke sistem multi-cabang basecamp dan menghadirkan perlindungan asuransi mikro pendakian langsung di dalam paket sewa."
)

# Slide 14
add_slide_section(
    14,
    "Kesimpulan & Sesi Tanya Jawab (Q&A)",
    "01_hero_showcase.png",
    "Menutup presentasi dengan kesimpulan yang kuat dan mengundang interaksi audiens.",
    [
        "Aman: Mitigasi risiko kehilangan alat dengan jaminan KTP fisik di brankas.",
        "Fleksibel: Kemudahan booking uang muka 30% dan pelunasan di toko.",
        "Praktis: Instalasi PWA langsung di HP dan hotline WhatsApp instan di 083851284143.",
        "Terukur: Dasbor kontrol omset dan laporan akuntansi siap ekspor."
    ],
    "Demikian presentasi tentang aplikasi TRIVA Outdoor Rental: Style on the Trail. TRIVA membuktikan bahwa teknologi dapat mengubah operasional persewaan outdoor yang dulunya rawan dan manual menjadi sebuah ekosistem digital yang aman, menguntungkan, dan membanggakan bagi komunitas pendaki. Terima kasih banyak atas perhatian dan waktu Bapak/Ibu sekalian. Sekarang, saya dengan senang hati membuka sesi tanya jawab atau demonstrasi langsung."
)

out_docx = r"C:\Users\Admin\.gemini\antigravity\scratch\triva-outdoor-rental\MATERI_PRESENTASI_TRIVA_OUTDOOR.docx"
doc.save(out_docx)
print("DOCX successfully generated at:", out_docx)
