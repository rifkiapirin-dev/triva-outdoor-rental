"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import TestimonialCommunitySection from "@/components/home/TestimonialCommunitySection";
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Tent,
  AlertTriangle,
  Receipt,
  PlusCircle,
  FileText,
  Search,
  Award,
  Settings,
  Trash2,
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Calendar,
  Filter,
  Save,
} from "lucide-react";
import { exportRentalsToExcel } from "@/lib/exportExcel";

export default function AdminDashboard() {
  const {
    rentals,
    items,
    currentUser,
    setShowNewRentalModal,
    updateRentalStatus,
    deleteRental,
    settings,
    persistCurrentPhotosToServer,
  } = useApp();

  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_month">("all");

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  const timeFilteredRentals = rentals.filter((r) => {
    const recordDate = r.createdAt ? r.createdAt.slice(0, 10) : r.startDate;
    if (timeFilter === "today" && recordDate !== todayStr) return false;
    if (timeFilter === "this_month" && !recordDate.startsWith(currentMonthStr)) return false;
    return true;
  });

  const totalOmset = timeFilteredRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalDpKas = timeFilteredRentals.reduce((sum, r) => sum + r.downPayment, 0);
  const totalRemaining = timeFilteredRentals.reduce((sum, r) => sum + r.remainingAmount, 0);
  const rentedItemsCount = items.filter((i) => i.status === "rented").length;
  const availableItemsCount = items.filter((i) => i.status === "available").length;
  const utilizationRate = Math.round((rentedItemsCount / items.length) * 100) || 0;
  const overdueCount = rentals.filter((r) => r.status === "active" && r.endDate < new Date().toISOString().slice(0, 10)).length;
  const ktpHeldCount = rentals.filter((r) => r.status === "active" || r.status === "confirmed").length;

  const filteredRentals = timeFilteredRentals.filter(
    (r) =>
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    let label = "Semua_Transaksi";
    if (timeFilter === "today") {
      label = `Harian_${todayStr}`;
    } else if (timeFilter === "this_month") {
      label = `Bulanan_${currentMonthStr}`;
    }
    exportRentalsToExcel(filteredRentals, label);
  };

  return (
    <div className="space-y-5">
      {/* Admin Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-triva-charcoal-800 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-triva-crimson/30 border border-triva-crimson/50 text-rose-300 text-[10px] font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5 text-triva-crimson" />
              Pusat Kendali Owner & Keuangan
            </div>
            <h1 className="text-xl font-extrabold mt-2 tracking-tight">
              Dashboard Eksekutif TRIVA
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Pantau arus kas, performa rental akhir pekan, utilisasi inventaris, dan kepatuhan staf.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => persistCurrentPhotosToServer()}
              className="px-3.5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5"
              title="Kunci seluruh foto manual ke file server fisik agar tidak pernah berubah lagi"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Foto Permanen</span>
            </button>
            <button
              onClick={() => setShowNewRentalModal(true)}
              className="px-4 py-2.5 bg-triva-crimson text-white rounded-xl text-xs font-bold shadow-lg shadow-triva-crimson/30 hover:bg-triva-crimson-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Sewa Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1">
        <div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-triva-crimson" />
            Ringkasan Keuangan & Utilisasi Toko
          </span>
          <span className="text-[11px] text-slate-400">
            {timeFilter === "today"
              ? "Periode: Hari Ini"
              : timeFilter === "this_month"
              ? "Periode: Bulan Ini"
              : "Periode: Akumulasi Seluruh Waktu"}
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold self-start sm:self-auto">
          <button
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setTimeFilter("today")}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeFilter === "today"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setTimeFilter("this_month")}
            className={`px-3 py-1 rounded-lg transition-all ${
              timeFilter === "this_month"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {/* 4 Financial & Business Metric Cards (Konsep 1: Modern Bento Grid + Sparkline & Fleet Progress Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KARTU 1: TOTAL OMSET RESERVASI */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-300 group-hover:bg-rose-500/20" />

          <div className="space-y-3 relative z-10">
            {/* Header: Squircle Icon + Trend Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-triva-crimson border border-rose-200/80 flex items-center justify-center shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                  Total Omset
                </span>
              </div>
              {rentals.length > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  <span>+18.4%</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                  <span>0 Pesanan</span>
                </span>
              )}
            </div>

            {/* Value */}
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Rp {totalOmset.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {timeFilter === "today"
                  ? "Transaksi rental hari ini"
                  : timeFilter === "this_month"
                  ? "Transaksi rental bulan ini"
                  : "Akumulasi seluruh pesanan aktif & booking"}
              </p>
            </div>

            {/* Visual SVG Mini Sparkline */}
            <div className="pt-1">
              <svg
                className="w-full h-9 overflow-visible"
                viewBox="0 0 100 28"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="omsetSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B0000" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B0000" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {totalOmset > 0 ? (
                  <>
                    <path
                      d="M0,24 Q18,25 32,18 T62,14 T82,8 T100,2 L100,28 L0,28 Z"
                      fill="url(#omsetSparkGrad)"
                    />
                    <path
                      d="M0,24 Q18,25 32,18 T62,14 T82,8 T100,2"
                      stroke="#8B0000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Sub-Metric Split Breakdown Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold relative z-10">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              DP: Rp {totalDpKas.toLocaleString("id-ID")}
            </span>
            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Sisa: Rp {totalRemaining.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* KARTU 2: UANG MASUK (KAS TOKO) */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20" />

          <div className="space-y-3 relative z-10">
            {/* Header: Squircle Icon + Verified Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                  Uang Masuk Kas
                </span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                <span>QRIS &amp; Transfer</span>
              </span>
            </div>

            {/* Value */}
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Rp {totalDpKas.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {timeFilter === "today"
                  ? "Kas DP hari ini via QRIS & Transfer"
                  : timeFilter === "this_month"
                  ? "Kas DP bulan ini via QRIS & Transfer"
                  : "DP & pelunasan masuk terverifikasi"}
              </p>
            </div>

            {/* Visual SVG Mini Sparkline */}
            <div className="pt-1">
              <svg
                className="w-full h-9 overflow-visible"
                viewBox="0 0 100 28"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="kasSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {totalDpKas > 0 ? (
                  <>
                    <path
                      d="M0,25 Q15,22 30,19 T60,13 T80,7 T100,3 L100,28 L0,28 Z"
                      fill="url(#kasSparkGrad)"
                    />
                    <path
                      d="M0,25 Q15,22 30,19 T60,13 T80,7 T100,3"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Cash Quality Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold relative z-10">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              100% Non-Tunai
            </span>
            <span className="text-slate-400">Bebas Selisih Kasir</span>
          </div>
        </div>

        {/* KARTU 3: UTILISASI ARMADA STOK (FLEET PROGRESS BAR) */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20" />

          <div className="space-y-3 relative z-10">
            {/* Header: Squircle Icon + Utilization Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shadow-xs">
                  <Tent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                  Utilisasi Stok
                </span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                <span>{utilizationRate}% Terpakai</span>
              </span>
            </div>

            {/* Value */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {rentedItemsCount}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  / {items.length} Unit Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {availableItemsCount} unit siap sewa di rak toko
              </p>
            </div>

            {/* Segmented Progress Bar */}
            <div className="pt-2">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60">
                {rentedItemsCount > 0 && (
                  <div
                    style={{
                      width: `${Math.round((rentedItemsCount / items.length) * 100)}%`,
                    }}
                    className="bg-emerald-500 rounded-full transition-all duration-500"
                    title={`Sedang Disewa: ${rentedItemsCount} Unit`}
                  />
                )}
                <div
                  style={{
                    width: `${Math.round((availableItemsCount / items.length) * 100)}%`,
                  }}
                  className="bg-blue-500 rounded-full transition-all duration-500"
                  title={`Siap Sewa: ${availableItemsCount} Unit`}
                />
              </div>
            </div>
          </div>

          {/* Micro Legend Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 relative z-10">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {rentedItemsCount} Sedang Disewa
            </span>
            <span className="flex items-center gap-1 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {availableItemsCount} Siap Rak
            </span>
          </div>
        </div>

        {/* KARTU 4: MONITORING RETUR & JAMINAN KTP */}
        <div
          className={`group relative overflow-hidden rounded-3xl bg-white border p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
            overdueCount > 0
              ? "border-rose-300 ring-2 ring-rose-500/20"
              : "border-slate-200/90"
          }`}
        >
          <div
            className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl transition-all duration-300 ${
              overdueCount > 0
                ? "bg-rose-500/20 group-hover:bg-rose-500/30"
                : "bg-amber-500/10 group-hover:bg-amber-500/20"
            }`}
          />

          <div className="space-y-3 relative z-10">
            {/* Header: Squircle Icon + Alert Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs border ${
                    overdueCount > 0
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200"
                  }`}
                >
                  {overdueCount > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                  Retur &amp; Jaminan
                </span>
              </div>

              {overdueCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  <span>{overdueCount} Telat</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span>Semua On-Time</span>
                </span>
              )}
            </div>

            {/* Value */}
            <div>
              <div
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  overdueCount > 0 ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {overdueCount > 0 ? `${overdueCount} Order Telat` : "0 Keterlambatan"}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {overdueCount > 0
                  ? "Potensi klaim denda berjalan di kasir"
                  : "Semua jadwal sewa tertib"}
              </p>
            </div>

            {/* Collateral Vault Mini Box */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-triva-crimson" />
                <span className="text-[11px] font-bold text-slate-800">
                  {ktpHeldCount} KTP Fisik di Brankas
                </span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Aman
              </span>
            </div>
          </div>

          {/* Quick Action Reminder Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 relative z-10">
            {overdueCount > 0 ? (
              <span className="text-rose-600 font-extrabold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Batas 21:00 WIB
              </span>
            ) : (
              <span className="text-slate-400">Pemeriksaan fisik wajib</span>
            )}
            <span className="text-triva-crimson hover:underline cursor-pointer">
              Audit Jaminan &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Auto-sliding Promo Banner Toko (Tampil Langsung di Layar Admin) */}
      <HeroBannerCarousel />

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Master Transaksi & Keamanan (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-triva-crimson" />
                <h2 className="text-sm font-bold text-slate-900">
                  Semua Transaksi &amp; Riwayat Kas
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredRentals.length} Order
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Audit transaksi sewa, jaminan KTP, dan rekapitulasi laporan.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Waktu Cepat */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTimeFilter("today")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === "today" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setTimeFilter("this_month")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === "this_month" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Bulan Ini
                </button>
              </div>

              {/* Tombol Export Excel */}
              <button
                onClick={handleExport}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                title="Unduh Laporan ke Excel (.csv)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>

              <div className="relative w-full sm:w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {filteredRentals.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400 space-y-2">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">Belum ada transaksi sewa</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Seluruh data demo telah direset dan dimulai dari 0. Klik tombol <strong>&quot;+ Input Sewa Manual&quot;</strong> atau lakukan pemesanan baru.
                </p>
              </div>
            ) : (
              filteredRentals.map((r) => (
                <div key={r.id} className="p-4 hover:bg-slate-50 flex items-center justify-between text-xs gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900">{r.bookingCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        r.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : r.status === "confirmed"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : r.status === "pending_dp"
                          ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {r.status === "pending_dp"
                        ? "⏳ Menunggu Verifikasi DP"
                        : r.status === "confirmed"
                        ? "✓ Siap Ambil"
                        : r.status === "active"
                        ? "⛺ Sedang Digunakan"
                        : r.status}
                    </span>
                    {r.handledByStaffName && (
                      <span className="text-[9px] text-slate-400 font-semibold">
                        &bull; Staf: {r.handledByStaffName}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-slate-800">
                    {r.customerName} <span className="text-slate-400 font-normal">({r.customerPhone})</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {r.items.map((i) => `${i.name} (${i.unitCode})`).join(", ")}
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div className="font-extrabold text-sm text-triva-crimson">
                    Rp {r.totalAmount.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    DP: Rp {r.downPayment.toLocaleString("id-ID")} &bull; Sisa: Rp {r.remainingAmount.toLocaleString("id-ID")}
                  </div>

                  {/* APPROVAL BUTTON DIRECTLY IN ADMIN IF pending_dp */}
                  {r.status === "pending_dp" && (
                    <div className="pt-1 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          if (confirm(`Setujui pesanan ${r.bookingCode} atas nama ${r.customerName}?\n\nPastikan DP sebesar Rp ${r.downPayment.toLocaleString("id-ID")} telah masuk.`)) {
                            updateRentalStatus(r.id, "confirmed");
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black active:scale-95 transition-all shadow-xs"
                      >
                        ✓ Setujui DP
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Tolak pesanan ${r.bookingCode}?`)) {
                            updateRentalStatus(r.id, "cancelled");
                          }
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-[10px] font-bold active:scale-95 transition-all"
                      >
                        ✕ Tolak
                      </button>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => {
                        if (confirm("Hapus transaksi ini secara permanen dari sistem?")) {
                          deleteRental(r.id);
                        }
                      }}
                      className="mt-0.5 text-[10px] font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Right Column: CRM Pelanggan & Pengaturan Toko (1 col) */}
        <div className="space-y-4">
          {/* CRM Rapor Loyalitas */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Rapor Pelanggan Setia (CRM)
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Dimas Anggara</div>
                  <div className="text-[10px] text-slate-400">5x Sewa &bull; Selalu Tepat Waktu</div>
                </div>
                <span className="font-bold text-emerald-600 text-[11px]">Member VIP</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Rian Saputra</div>
                  <div className="text-[10px] text-slate-400">3x Sewa &bull; Paket Berdua</div>
                </div>
                <span className="font-bold text-blue-600 text-[11px]">Member Aktif</span>
              </div>
            </div>
          </div>

          {/* Konfigurasi Kebijakan Toko */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-slate-600" />
                Aturan Toko TRIVA
              </h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Minimal Uang Muka (DP):</span>
                <strong className="text-slate-900">{settings.minDpPercentage}% Total</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Denda Keterlambatan:</span>
                <strong className="text-rose-600">Rp {settings.lateFeePerDay.toLocaleString("id-ID")}/hari</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Batas Pengembalian:</span>
                <strong className="text-slate-900">Maks Pukul {settings.returnDeadlineHour} WIB</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimoni & Galeri Komunitas Pendaki TRIVA */}
      <TestimonialCommunitySection />
    </div>
  );
}
