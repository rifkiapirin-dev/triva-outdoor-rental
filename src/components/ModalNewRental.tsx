"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { RentalItem, PaymentMethod, GearItem } from "@/types";
import {
  X,
  Calendar,
  Tent,
  Camera,
  MessageCircle,
  CreditCard,
  Shield,
  Plus,
  Trash2,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  QrCode,
  Copy,
  CheckCircle2,
  Download,
  Building,
  Landmark,
  ExternalLink,
} from "lucide-react";

export default function ModalNewRental() {
  const {
    showNewRentalModal,
    setShowNewRentalModal,
    items,
    categories,
    addRental,
    currentUser,
    settings,
    preselectedItem,
    notify,
    cart,
    clearCart,
  } = useApp();

  // 1. ALL REACT HOOKS CALLED UNCONDITIONALLY AT TOP LEVEL
  const [customerName, setCustomerName] = useState(
    currentUser.role === "customer" ? currentUser.name : ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentUser.role === "customer" ? currentUser.phoneWa : ""
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [selectedItems, setSelectedItems] = useState<RentalItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [idCardType, setIdCardType] = useState<"KTP Asli" | "SIM" | "Kartu Mahasiswa">("KTP Asli");
  const [ktpPhotoSimulated, setKtpPhotoSimulated] = useState(false);
  const [notes, setNotes] = useState("");
  const [customDownPayment, setCustomDownPayment] = useState<number | null>(null);

  // Wizard Step State (Konsep A: 1. Jadwal & Alat -> 2. Identitas & Jaminan -> 3. Rincian & DP)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Completed Booking Details for QRIS & Bank Transfer Payment Display
  const [completedBooking, setCompletedBooking] = useState<{
    bookingCode: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    downPayment: number;
    remainingAmount: number;
    paymentMethod: "qris" | "transfer";
    items: RentalItem[];
    startDate: string;
    endDate: string;
    durationDays: number;
    waUrl: string;
  } | null>(null);
  const [activePaymentTab, setActivePaymentTab] = useState<"qris" | "transfer">("qris");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(label);
    notify(`${label} berhasil disalin!`, "success");
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Visual Product Selector Filter States
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync user details if current user changes
  useEffect(() => {
    if (currentUser.role === "customer") {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phoneWa);
    }
  }, [currentUser]);

  // Pre-load items when opened directly from a product card OR from cart
  useEffect(() => {
    if (showNewRentalModal) {
      if (preselectedItem) {
        setSelectedItems([
          {
            itemId: preselectedItem.id,
            unitCode: preselectedItem.unitCode,
            name: preselectedItem.name,
            pricePerDay: preselectedItem.pricePerDay,
            qty: 1,
          },
        ]);
      } else if (cart.length > 0) {
        setSelectedItems(
          cart.map((c) => ({
            itemId: c.item.id,
            unitCode: c.item.unitCode,
            name: c.item.name,
            pricePerDay: c.item.pricePerDay,
            qty: c.qty,
          }))
        );
      }
    }
  }, [showNewRentalModal, preselectedItem, cart]);

  // Reset custom DP when items change
  useEffect(() => {
    setCustomDownPayment(null);
  }, [selectedItems, startDate, endDate]);

  // Helper to get image URL for an item
  const getItemImage = (itemId: string) => {
    const found = items.find((it) => it.id === itemId);
    return found?.imageUrl || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop&q=80";
  };

  // 2. PURE CALCULATION LOGIC (NO HOOKS)
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const durationDays = calculateDays();

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.pricePerDay * durationDays * item.qty,
    0
  );
  const minDp = Math.round((totalAmount * settings.minDpPercentage) / 100);
  const downPayment = customDownPayment !== null ? customDownPayment : minDp;
  const remainingAmount = Math.max(0, totalAmount - downPayment);

  // Filter available items for the visual catalog selector
  const filteredAvailableItems = items.filter((it) => {
    // Only available items or currently selected items
    if (it.status !== "available" && !selectedItems.some((si) => si.itemId === it.id)) {
      return false;
    }
    // Category filter
    if (selectedCategorySlug !== "ALL") {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat && it.categoryId !== cat.id) return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = it.name.toLowerCase().includes(q);
      const matchCode = it.unitCode.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }
    return true;
  });

  // Handlers for Visual Product Selection
  const handleToggleItem = (itemObj: GearItem) => {
    const isSelected = selectedItems.some((si) => si.itemId === itemObj.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i.itemId !== itemObj.id));
    } else {
      const newItem: RentalItem = {
        itemId: itemObj.id,
        unitCode: itemObj.unitCode,
        name: itemObj.name,
        pricePerDay: itemObj.pricePerDay,
        qty: 1,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.itemId !== itemId));
  };

  const handleClose = () => {
    setShowNewRentalModal(false);
    setCustomDownPayment(null);
    setWizardStep(1);
    setSearchQuery("");
    setSelectedCategorySlug("ALL");
    setCompletedBooking(null);
    setCopiedField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      alert("Mohon lengkapi Nama & Nomor WhatsApp penyewa!");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Pilih minimal satu alat untuk disewa!");
      return;
    }

    const initialStatus =
      currentUser.role === "customer" ? "pending_dp" : "active";

    const code = `TRV-${new Date().getFullYear().toString().slice(-2)}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    addRental({
      customerId: currentUser.id,
      customerName,
      customerPhone,
      handledByStaffName:
        currentUser.role !== "customer" ? currentUser.name : undefined,
      startDate,
      endDate,
      durationDays,
      items: selectedItems,
      totalAmount,
      downPayment: Number(downPayment),
      remainingAmount,
      paymentMethod,
      status: initialStatus,
      idCardType,
      ktpPhotoUrl: ktpPhotoSimulated
        ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
        : undefined,
      notes,
    });

    // Generate WhatsApp direct reservation text
    const waText = encodeURIComponent(
      `*KONFIRMASI RESERVASI & PEMBAYARAN DP TRIVA OUTDOOR*\n\n` +
      `Halo Kak *${customerName}*,\n` +
      `Terima kasih telah melakukan reservasi sewa alat di *${settings.storeName}*.\n\n` +
      `🔖 *Kode Booking:* #${code}\n` +
      `📅 *Jadwal Sewa:* ${startDate} s/d ${endDate} (${durationDays} Hari Kalender)\n` +
      `🎒 *Daftar Perlengkapan:*\n` +
      selectedItems.map((it) => `- ${it.name} (${it.unitCode}) x${it.qty}`).join("\n") + "\n\n" +
      `💵 *Rincian Pembayaran DP:*\n` +
      `- Total Biaya Sewa: Rp ${totalAmount.toLocaleString("id-ID")}\n` +
      `- Tagihan DP: *Rp ${Number(downPayment).toLocaleString("id-ID")}* via ${
        paymentMethod === "qris" ? "QRIS Instan" : "Transfer Bank"
      }\n` +
      `- Sisa Pelunasan di Toko: Rp ${remainingAmount.toLocaleString("id-ID")}\n` +
      `- Jaminan Fisik Wajib: ${idCardType} Asli (Disimpan di Brankas Toko)\n\n` +
      `📍 *Alamat Toko:* ${settings.storeAddress}\n` +
      `⏰ *Batas Jam Pengembalian:* Pukul ${settings.returnDeadlineHour} WIB di hari terakhir.\n\n` +
      `Saya kirimkan bukti pembayaran DP saya ya min.`
    );

    const cleanPhone = customerPhone.replace(/\D/g, "").replace(/^0/, "62");
    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

    // Kosongkan keranjang belanja karena sudah berhasil dipesan
    clearCart();

    // Switch view to completed payment screen
    setCompletedBooking({
      bookingCode: code,
      customerName,
      customerPhone,
      totalAmount,
      downPayment: Number(downPayment),
      remainingAmount,
      paymentMethod: paymentMethod as "qris" | "transfer",
      items: selectedItems,
      startDate,
      endDate,
      durationDays,
      waUrl,
    });
    setActivePaymentTab(paymentMethod as "qris" | "transfer");
    notify(
      "Pemesanan berhasil disimpan & stok terkunci! Silakan lakukan pembayaran DP.",
      "success"
    );
  };

  // 3. SAFE CONDITIONAL RENDER: CALLED ONLY AFTER ALL HOOKS EXECUTE
  if (!showNewRentalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-6 transition-all duration-300 max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        
        {/* ========================================================================= */}
        {/* 1. TAMPILAN PEMBAYARAN SELESAI (KODE QRIS & REKENING BANK) */}
        {/* ========================================================================= */}
        {completedBooking ? (
          <div>
            {/* Header Sukses Pembayaran */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-950 text-white flex items-center justify-between border-b border-emerald-900/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight">Instruksi Pembayaran DP Sewa</h2>
                  <p className="text-[10px] text-emerald-200 font-medium">
                    Kode Booking: #{completedBooking.bookingCode} &bull; {settings.storeName}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Instruksi Pembayaran */}
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-4">
              {/* Alert Status */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-emerald-950">
                    Pemesanan Berhasil Disimpan & Stok Terkunci! 🎉
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Selesaikan pembayaran DP di bawah ini agar jadwal reservasi tidak terbatalkan otomatis.
                  </p>
                </div>
              </div>

              {/* Tagihan DP Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tagihan Uang Muka (DP Wajib):
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-triva-crimson font-mono">
                    Rp {completedBooking.downPayment.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-semibold">Sisa Pelunasan di Toko:</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    Rp {completedBooking.remainingAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Tab Switcher: QRIS vs Transfer Bank */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActivePaymentTab("qris")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    activePaymentTab === "qris"
                      ? "bg-white text-triva-crimson shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>📱 Bayar via Kode QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab("transfer")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    activePaymentTab === "transfer"
                      ? "bg-white text-triva-crimson shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>🏦 Transfer Rekening Bank</span>
                </button>
              </div>

              {/* VIEW 1: QRIS CODE DISPLAY */}
              {activePaymentTab === "qris" && (
                <div className="bg-white rounded-2xl border-2 border-slate-900 p-4 sm:p-5 shadow-lg space-y-3.5 text-center animate-in fade-in duration-150">
                  {/* QRIS Header Banner */}
                  <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] font-black tracking-widest text-rose-600 uppercase block">
                        QRIS &bull; Standar Pembayaran Nasional
                      </span>
                      <h4 className="text-xs font-black text-slate-900">{settings.storeName}</h4>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">NMID: ID1026008899001</span>
                  </div>

                  {/* High Quality Authentic SVG QR Code */}
                  <div className="mx-auto w-52 h-52 p-3 bg-white rounded-2xl border border-slate-300 shadow-inner flex flex-col items-center justify-center relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Top-Left Finder */}
                      <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                      <rect x="13" y="13" width="10" height="10" rx="1" fill="#8B0000" />

                      {/* Top-Right Finder */}
                      <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                      <rect x="77" y="13" width="10" height="10" rx="1" fill="#8B0000" />

                      {/* Bottom-Left Finder */}
                      <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                      <rect x="13" y="77" width="10" height="10" rx="1" fill="#8B0000" />

                      {/* Alignment & Data Pattern Grid */}
                      <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                      <rect x="46" y="8" width="8" height="6" fill="#0f172a" />
                      <rect x="58" y="8" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="18" width="8" height="8" fill="#0f172a" />
                      <rect x="48" y="18" width="6" height="6" fill="#0f172a" />
                      <rect x="58" y="18" width="8" height="6" fill="#0f172a" />

                      <rect x="8" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="18" y="36" width="8" height="8" fill="#0f172a" />
                      <rect x="8" y="46" width="6" height="8" fill="#0f172a" />
                      <rect x="18" y="48" width="8" height="6" fill="#0f172a" />
                      <rect x="8" y="58" width="8" height="6" fill="#0f172a" />

                      <rect x="36" y="36" width="8" height="8" fill="#0f172a" />
                      <rect x="56" y="36" width="8" height="8" fill="#0f172a" />
                      <rect x="36" y="56" width="8" height="8" fill="#0f172a" />
                      <rect x="56" y="56" width="8" height="8" fill="#0f172a" />

                      <rect x="68" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="78" y="36" width="8" height="8" fill="#0f172a" />
                      <rect x="88" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="68" y="46" width="8" height="6" fill="#0f172a" />
                      <rect x="80" y="48" width="6" height="8" fill="#0f172a" />
                      <rect x="68" y="58" width="8" height="8" fill="#0f172a" />
                      <rect x="80" y="60" width="8" height="6" fill="#0f172a" />

                      <rect x="36" y="72" width="6" height="8" fill="#0f172a" />
                      <rect x="46" y="70" width="8" height="6" fill="#0f172a" />
                      <rect x="58" y="72" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="84" width="8" height="6" fill="#0f172a" />
                      <rect x="48" y="82" width="6" height="8" fill="#0f172a" />
                      <rect x="58" y="84" width="8" height="6" fill="#0f172a" />
                      <rect x="70" y="80" width="6" height="8" fill="#0f172a" />
                      <rect x="82" y="78" width="8" height="6" fill="#0f172a" />
                      <rect x="76" y="88" width="8" height="6" fill="#0f172a" />

                      {/* Center TRIVA Squircle Badge */}
                      <rect x="37" y="37" width="26" height="26" rx="6" fill="#8B0000" stroke="white" strokeWidth="2.5" />
                      <text x="50" y="53" fill="white" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">TRIVA</text>
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-800">
                      Total DP: Rp {completedBooking.downPayment.toLocaleString("id-ID")}
                    </div>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Dukung scan melalui <strong>GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, LinkAja</strong>, dan seluruh aplikasi m-banking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Kode QRIS TRIVA siap dipindai di layar atau diunduh!")}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Gambar QR</span>
                    </button>
                    <a
                      href={completedBooking.waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Kirim Bukti Bayar ke WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* VIEW 2: TRANSFER BANK DISPLAY */}
              {activePaymentTab === "transfer" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3.5 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-triva-crimson" />
                      <span>Daftar Rekening Resmi {settings.storeName}</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Silakan transfer tepat sejumlah DP ke salah satu rekening bank di bawah ini:
                    </p>
                  </div>

                  {/* Nominal Card with 1-Click Copy */}
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Nominal Transfer DP Tepat:</span>
                      <span className="text-sm sm:text-base font-black text-triva-crimson font-mono">
                        Rp {completedBooking.downPayment.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(String(completedBooking.downPayment), "Nominal DP")}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-rose-300 bg-white text-triva-crimson hover:bg-rose-50 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === "Nominal DP" ? "Tersalin! ✓" : "Salin Nominal"}</span>
                    </button>
                  </div>

                  {/* Bank Accounts List */}
                  <div className="space-y-2">
                    {/* BCA */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          BCA
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800 font-mono tracking-wide">148-092-8811</div>
                          <div className="text-[10px] text-slate-500 font-medium">a/n PT TRIVA OUTDOOR INDONESIA</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("1480928811", "Nomor Rekening BCA")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 ${
                          copiedField === "Nomor Rekening BCA"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedField === "Nomor Rekening BCA" ? "Tersalin! ✓" : "Salin Rekening"}</span>
                      </button>
                    </div>

                    {/* MANDIRI */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          MDR
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800 font-mono tracking-wide">131-00-998822-1</div>
                          <div className="text-[10px] text-slate-500 font-medium">a/n TRIVA OUTDOOR</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("131009988221", "Nomor Rekening Mandiri")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 ${
                          copiedField === "Nomor Rekening Mandiri"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedField === "Nomor Rekening Mandiri" ? "Tersalin! ✓" : "Salin Rekening"}</span>
                      </button>
                    </div>

                    {/* BRI */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          BRI
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800 font-mono tracking-wide">0123-01-002233-50-8</div>
                          <div className="text-[10px] text-slate-500 font-medium">a/n TRIVA OUTDOOR</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("012301002233508", "Nomor Rekening BRI")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 ${
                          copiedField === "Nomor Rekening BRI"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedField === "Nomor Rekening BRI" ? "Tersalin! ✓" : "Salin Rekening"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <a
                      href={completedBooking.waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi Bukti Transfer via WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Close / Finish Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Selesai & Tutup Jendela</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. FORMULIR WIZARD NORMAL (LANGKAH 1, 2, 3) */
          /* ========================================================================= */
          <div>
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-triva-crimson to-rose-950 text-white flex items-center justify-between border-b border-rose-900/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                  <Tent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight">Formulir Sewa Alat Outdoor</h2>
                  <p className="text-[10px] text-rose-200 font-medium">TRIVA &bull; Style on the Trail</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Stepper Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <div className="max-w-md mx-auto relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0"></div>
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-triva-crimson transition-all duration-300 -z-0 ${
                    wizardStep === 1 ? "w-0" : wizardStep === 2 ? "w-1/2" : "w-full"
                  }`}
                ></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center relative z-10 cursor-pointer" onClick={() => setWizardStep(1)}>
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                      wizardStep >= 1
                        ? "bg-triva-crimson text-white ring-4 ring-rose-100 shadow-sm"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-[10px] font-black mt-1 ${wizardStep === 1 ? "text-triva-crimson" : "text-slate-600"}`}>
                    Jadwal & Alat
                  </span>
                </div>

                {/* Step 2 */}
                <div
                  className="flex flex-col items-center relative z-10 cursor-pointer"
                  onClick={() => {
                    if (selectedItems.length > 0) setWizardStep(2);
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                      wizardStep >= 2
                        ? "bg-triva-crimson text-white ring-4 ring-rose-100 shadow-sm"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-[10px] font-black mt-1 ${wizardStep === 2 ? "text-triva-crimson" : "text-slate-600"}`}>
                    Identitas & KTP
                  </span>
                </div>

                {/* Step 3 */}
                <div
                  className="flex flex-col items-center relative z-10 cursor-pointer"
                  onClick={() => {
                    if (selectedItems.length > 0 && customerName && customerPhone) setWizardStep(3);
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                      wizardStep === 3
                        ? "bg-triva-crimson text-white ring-4 ring-rose-100 shadow-sm"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-[10px] font-black mt-1 ${wizardStep === 3 ? "text-triva-crimson" : "text-slate-600"}`}>
                    Rincian & Bayar
                  </span>
                </div>
              </div>
            </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* ========================================================================= */}
          {/* TAHAP 1: JADWAL & PEMILIHAN PERLENGKAPAN SECARA VISUAL */}
          {/* ========================================================================= */}
          {wizardStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Jadwal Kalender Inklusif */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-triva-crimson" />
                    <span>Jadwal Sewa (Hitungan Kalender Inklusif)</span>
                  </label>
                  <span className="text-[11px] font-black text-triva-crimson bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    {durationDays} Hari Sewa
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Tgl Ambil</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-triva-crimson"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Tgl Kembali (Maks 21:00)</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-triva-crimson"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PEMILIHAN PRODUK SECARA VISUAL (Bukan hanya teks biasa!) */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Tent className="w-4 h-4 text-triva-crimson" />
                      <span>Pilih Perlengkapan dari Katalog Visual</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Klik pada kartu produk di bawah untuk menambah atau melepas alat sewa
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                    {filteredAvailableItems.length} Alat Tersedia
                  </span>
                </div>

                {/* Search Bar & Category Filter Pills */}
                <div className="space-y-2">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari alat (misal: Tenda Eiger, Carrier Deuter, Kompor, Celana)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson bg-white font-medium"
                    />
                  </div>

                  {/* Category Pills (Horizontal Scroll) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedCategorySlug("ALL")}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                        selectedCategorySlug === "ALL"
                          ? "bg-triva-crimson text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Semua (49)
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategorySlug(cat.slug)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                          selectedCategorySlug === cat.slug
                            ? "bg-triva-crimson text-white shadow-sm"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Product Grid (Scrollable Gallery) */}
                <div className="max-h-64 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredAvailableItems.length > 0 ? (
                    filteredAvailableItems.map((item) => {
                      const isSelected = selectedItems.some((si) => si.itemId === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleItem(item)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? "bg-rose-50/80 border-triva-crimson shadow-sm ring-1 ring-triva-crimson"
                              : "bg-white border-slate-200 hover:border-rose-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={
                                item.imageUrl ||
                                "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=200&auto=format&fit=crop&q=80"
                              }
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-sm"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                  {item.unitCode}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                                  {item.categoryName}
                                </span>
                              </div>
                              <p className="text-xs font-black text-slate-800 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-[11px] font-black text-triva-crimson">
                                Rp {item.pricePerDay.toLocaleString("id-ID")}
                                <span className="text-[9px] font-normal text-slate-400">/hari</span>
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <button
                              type="button"
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                                isSelected
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-triva-crimson hover:text-white"
                              }`}
                            >
                              {isSelected ? "✓ Terpilih" : "+ Pilih"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      Tidak ada alat yang cocok dengan kata kunci "{searchQuery}".
                    </div>
                  )}
                </div>

                {/* Keranjang Perlengkapan Terpilih (Dengan Foto Produk) */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-triva-crimson" />
                      <span>Keranjang Sewa ({selectedItems.length} Alat Terpilih)</span>
                    </span>
                    {selectedItems.length > 0 && (
                      <span className="text-xs font-black text-triva-crimson">
                        Subtotal: Rp {totalAmount.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  {selectedItems.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white max-h-44 overflow-y-auto">
                      {selectedItems.map((item) => (
                        <div key={item.itemId} className="p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getItemImage(item.itemId)}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-extrabold text-slate-800 truncate">
                                {item.name} <span className="text-triva-crimson font-mono font-bold">({item.unitCode})</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Rp {item.pricePerDay.toLocaleString("id-ID")} &times; {durationDays} hari
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-black text-slate-800">
                              Rp {(item.pricePerDay * durationDays * item.qty).toLocaleString("id-ID")}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.itemId)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Hapus alat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                      Belum ada alat dipilih. Silakan klik tombol <strong>[+ Pilih]</strong> pada produk di atas.
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1 Navigation Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs">
                  <span className="text-slate-400">Estimasi Total: </span>
                  <span className="font-black text-slate-900 text-sm">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert("Pilih minimal satu alat sebelum melanjutkan!");
                      return;
                    }
                    setWizardStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-triva-crimson to-rose-800 hover:from-triva-crimson-700 hover:to-rose-900 text-white font-black text-xs shadow-md shadow-rose-950/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Lanjut: Identitas & Jaminan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAHAP 2: IDENTITAS PENYEWA & JAMINAN FISIK KTP ASLI */}
          {/* ========================================================================= */}
          {wizardStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Identitas Penyewa */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="text-xs font-black text-slate-800 block">
                  Identitas Penyewa (Pendaki)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Nama Lengkap (Sesuai KTP)</span>
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-triva-crimson"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Nomor WhatsApp Aktif</span>
                    <input
                      type="tel"
                      placeholder="Nomor WhatsApp (08...)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-triva-crimson"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Jaminan Fisik Wajib Ditahan */}
              <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Jaminan Fisik Wajib Ditahan di Toko</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Wajib Ditahan
                  </span>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Penyewa wajib menyerahkan 1 kartu identitas fisik asli saat serah terima barang di gerai TRIVA Outdoor. Kartu identitas disimpan di brankas toko dan dikembalikan saat alat kembali utuh.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-amber-900 font-bold block mb-1">Jenis Jaminan Fisik</span>
                    <select
                      value={idCardType}
                      onChange={(e) => setIdCardType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-amber-200 bg-white font-bold text-amber-950"
                    >
                      <option value="KTP Asli">E-KTP Fisik Asli (Utama)</option>
                      <option value="SIM">SIM A/C Fisik Asli</option>
                      <option value="Kartu Mahasiswa">KTM + Kartu Keluarga</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-900 font-bold block mb-1">Slot Penyimpanan Brankas</span>
                    <div className="text-xs font-mono font-bold px-3 py-2 rounded-xl border border-amber-300 bg-white text-amber-900">
                      Laci Brankas Kasir #A-08
                    </div>
                  </div>
                </div>

                {/* Simulator Kamera KTP */}
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-semibold text-slate-700">
                      {ktpPhotoSimulated ? "Foto KTP Tersimpan di Sistem" : "Ambil Foto KTP via Kamera"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKtpPhotoSimulated(!ktpPhotoSimulated)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${
                      ktpPhotoSimulated
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-triva-crimson text-white hover:bg-triva-crimson-700 shadow-sm"
                    }`}
                  >
                    {ktpPhotoSimulated ? "Sudah Terjepret ✓" : "Jepret KTP"}
                  </button>
                </div>
              </div>

              {/* Catatan Destinasi */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">Catatan Pendakian (Opsional):</span>
                <textarea
                  placeholder="Nama gunung tujuan, estimasi jalur, atau permintaan khusus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson bg-slate-50/50"
                />
              </div>

              {/* Step 2 Navigation Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Alat</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!customerName || !customerPhone) {
                      alert("Mohon lengkapi Nama dan Nomor WhatsApp!");
                      return;
                    }
                    setWizardStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-triva-crimson to-rose-800 hover:from-triva-crimson-700 hover:to-rose-900 text-white font-black text-xs shadow-md shadow-rose-950/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Lanjut: Rincian & DP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAHAP 3: RINCIAN BIAYA, PILIHAN DP & SELESAIKAN RESERVASI */}
          {/* ========================================================================= */}
          {wizardStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 font-semibold block">Total Biaya Sewa:</span>
                    <span className="text-[10px] text-slate-400">
                      {selectedItems.length} alat &times; {durationDays} hari pendakian
                    </span>
                  </div>
                  <span className="font-black text-lg text-slate-900">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Quick DP Selector Buttons */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
                    Pilihan Pembayaran Awal (DP):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomDownPayment(minDp)}
                      className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center ${
                        downPayment === minDp
                          ? "bg-triva-crimson text-white border-triva-crimson shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      DP 30%<br />
                      <span className="text-[10px] font-normal">Rp {minDp.toLocaleString("id-ID")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomDownPayment(Math.round(totalAmount * 0.5))}
                      className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center ${
                        downPayment === Math.round(totalAmount * 0.5)
                          ? "bg-triva-crimson text-white border-triva-crimson shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      DP 50%<br />
                      <span className="text-[10px] font-normal">
                        Rp {Math.round(totalAmount * 0.5).toLocaleString("id-ID")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomDownPayment(totalAmount)}
                      className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center ${
                        downPayment === totalAmount
                          ? "bg-triva-crimson text-white border-triva-crimson shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Lunas 100%<br />
                      <span className="text-[10px] font-normal">Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold block mb-0.5">Uang Muka (DP Masuk):</span>
                    <div className="font-black text-emerald-900 text-sm">
                      Rp {Number(downPayment).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-triva-crimson font-bold block mb-0.5">Sisa Pelunasan di Toko:</span>
                    <div className="font-black text-triva-crimson text-sm">
                      Rp {remainingAmount.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Metode Pembayaran DP (Hanya Non-Tunai: QRIS & Transfer Bank) */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Metode Pembayaran DP (Wajib Non-Tunai):
                    </span>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Kunci Stok Online
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === "qris"
                          ? "bg-triva-crimson text-white border-triva-crimson shadow-md shadow-rose-950/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>📱 QRIS Instan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("transfer")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === "transfer"
                          ? "bg-triva-crimson text-white border-triva-crimson shadow-md shadow-rose-950/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>🏦 Transfer Bank</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic leading-snug">
                    * Pembayaran DP wajib non-tunai via QRIS/Transfer untuk mengunci ketersediaan unit. Pelunasan sisa sewa dapat dibayar tunai (cash) langsung di kasir toko saat serah-terima alat.
                  </p>
                </div>
              </div>

              {/* Ringkasan Jaminan & Pengembalian */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">Jaminan Fisik Ditahan di Kasir:</span>
                  <span className="font-black text-amber-950">{idCardType} Asli</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block">Batas Pengembalian:</span>
                  <span className="font-bold text-slate-800">Maks Pukul {settings.returnDeadlineHour} WIB</span>
                </div>
              </div>

              {/* Step 3 Navigation Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali ke Jaminan</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-xl shadow-emerald-950/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Selesaikan & Kunci Stok</span>
                </button>
              </div>
            </div>
          )}

        </form>
          </div>
        )}
      </div>
    </div>
  );
}
