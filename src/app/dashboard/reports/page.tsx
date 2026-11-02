"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Shield,
  Download,
  Calendar,
  Package,
} from "lucide-react";
import { exportRentalsToExcel } from "@/lib/exportExcel";

export default function ReportsPage() {
  const { rentals, currentUser } = useApp();
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_month">("all");

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  if (currentUser.role !== "admin") {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-triva-crimson flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-base font-black text-slate-900">Akses Dibatasi: Khusus Owner / Admin</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Laporan keuangan, omset toko, dan analisis CRM hanya dapat diakses oleh akun Admin (Rifki).
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors mt-2"
        >
          &larr; Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const filteredRentals = rentals.filter((r) => {
    const recordDate = r.createdAt ? r.createdAt.slice(0, 10) : r.startDate;
    if (timeFilter === "today" && recordDate !== todayStr) return false;
    if (timeFilter === "this_month" && !recordDate.startsWith(currentMonthStr)) return false;
    return true;
  });

  const totalOmset = filteredRentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalDpKas = filteredRentals.reduce((sum, r) => sum + r.downPayment, 0);
  const totalCompleted = filteredRentals.filter((r) => r.status === "returned" || r.status === "active").length;
  const avgRental = filteredRentals.length > 0 ? Math.round(totalOmset / filteredRentals.length) : 0;

  // Dynamic CRM Loyal Customers computation from real transactions
  const customerMap = new Map<
    string,
    {
      name: string;
      phone: string;
      rentalsCount: number;
      totalSpent: number;
      itemFrequency: Record<string, number>;
    }
  >();

  filteredRentals.forEach((r) => {
    const key = (r.customerPhone || r.customerName || "Pelanggan").trim();
    const existing = customerMap.get(key) || {
      name: r.customerName,
      phone: r.customerPhone || "-",
      rentalsCount: 0,
      totalSpent: 0,
      itemFrequency: {},
    };
    existing.rentalsCount += 1;
    existing.totalSpent += r.totalAmount;
    if (Array.isArray(r.items)) {
      r.items.forEach((it) => {
        existing.itemFrequency[it.name] = (existing.itemFrequency[it.name] || 0) + it.qty;
      });
    }
    customerMap.set(key, existing);
  });

  const dynamicCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map((c) => {
      let topItem = "";
      let maxQty = 0;
      Object.entries(c.itemFrequency).forEach(([item, qty]) => {
        if (qty > maxQty) {
          maxQty = qty;
          topItem = item;
        }
      });
      return {
        name: c.name,
        phone: c.phone,
        rentalsCount: c.rentalsCount,
        totalSpent: c.totalSpent,
        tag: topItem ? `Favorit: ${topItem}` : "Pelanggan Aktif",
      };
    });

  const loyalCustomers =
    dynamicCustomers.length > 0
      ? dynamicCustomers
      : [
          {
            name: "Dimas Anggara",
            phone: "085712349988",
            rentalsCount: 5,
            totalSpent: 1250000,
            tag: "Sering Sewa Tenda 4P",
          },
          {
            name: "Rian Saputra",
            phone: "081399887766",
            rentalsCount: 3,
            totalSpent: 630000,
            tag: "Paket Summit Berdua",
          },
          {
            name: "Aldi Kurniawan",
            phone: "082155443322",
            rentalsCount: 2,
            totalSpent: 360000,
            tag: "Pelanggan Baru",
          },
        ];

  // Top Rented Equipment Analytics
  const gearPopularityMap = new Map<
    string,
    { name: string; unitCode: string; totalQty: number; revenue: number }
  >();

  filteredRentals.forEach((r) => {
    if (Array.isArray(r.items)) {
      r.items.forEach((it) => {
        const existing = gearPopularityMap.get(it.itemId) || {
          name: it.name,
          unitCode: it.unitCode,
          totalQty: 0,
          revenue: 0,
        };
        existing.totalQty += it.qty;
        existing.revenue += it.pricePerDay * (r.durationDays || 1) * it.qty;
        gearPopularityMap.set(it.itemId, existing);
      });
    }
  });

  const topGearList = Array.from(gearPopularityMap.values())
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 5);

  const handleExport = () => {
    let label = "Laporan_Keuangan_TRIVA";
    if (timeFilter === "today") label += `_Harian_${todayStr}`;
    else if (timeFilter === "this_month") label += `_Bulanan_${currentMonthStr}`;
    else label += "_Semua_Periode";
    exportRentalsToExcel(filteredRentals, label);
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-triva-crimson" />
            Laporan Keuangan & CRM Owner
          </h1>
          <p className="text-xs text-slate-500">
            Statistik performa bisnis rental TRIVA Outdoor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Period Filter */}
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

          {/* Export Excel Button */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            title="Unduh Laporan ke Excel (.csv)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Akumulasi Omset</span>
          <span className="text-xl font-extrabold text-triva-crimson mt-1 block">
            Rp {totalOmset.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {timeFilter === "today" ? "Hari ini" : timeFilter === "this_month" ? "Bulan ini" : "Semua waktu"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Kas DP Diterima</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
            Rp {totalDpKas.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Dana riil di kas toko / QRIS
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Pesanan Berjalan / Selesai</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">
            {totalCompleted} Transaksi
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Dari {filteredRentals.length} reservasi periode ini
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Rata-rata Nilai Transaksi</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">
            Rp {avgRental.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Per booking pendakian
          </span>
        </div>
      </div>

      {/* Grid: CRM Pelanggan Setia & Alat Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CRM Pelanggan Setia */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              CRM: Pelanggan Paling Loyal
            </h2>
            <span className="text-[10px] text-slate-400">Rapor Sewa ({loyalCustomers.length} Teratas)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {loyalCustomers.map((c, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.phone} &bull; {c.tag}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 block">{c.rentalsCount}x Sewa</span>
                  <span className="text-[10px] text-triva-crimson font-bold">
                    Rp {c.totalSpent.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analisis Alat Terlaris */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-500" />
              Alat Paling Sering Disewa
            </h2>
            <span className="text-[10px] text-slate-400">Utilisasi Alat ({topGearList.length} Teratas)</span>
          </div>

          {topGearList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada data persewaan alat untuk periode ini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topGearList.map((g, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{g.name}</div>
                    <div className="text-[10px] text-slate-400">Unit: {g.unitCode}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 block">{g.totalQty} Unit Tersewa</span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Kontribusi: Rp {g.revenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
