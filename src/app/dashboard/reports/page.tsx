"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { BarChart3, TrendingUp, DollarSign, Users, Award, Shield } from "lucide-react";

export default function ReportsPage() {
  const { rentals, currentUser } = useApp();

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

  const totalOmset = rentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalCompleted = rentals.filter((r) => r.status === "returned" || r.status === "active").length;
  const avgRental = totalCompleted > 0 ? Math.round(totalOmset / rentals.length) : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-triva-crimson" />
          Laporan Keuangan & CRM Owner
        </h1>
        <p className="text-xs text-slate-500">
          Statistik performa bisnis rental TRIVA Outdoor.
        </p>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Akumulasi Omset</span>
          <span className="text-xl font-extrabold text-triva-crimson mt-1 block">
            Rp {totalOmset.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Performa Sehat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Pesanan Berjalan</span>
          <span className="text-xl font-extrabold text-slate-800 mt-1 block">
            {totalCompleted} Transaksi
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Dari {rentals.length} total reservasi
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

      {/* CRM Pelanggan Setia */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            CRM: Pelanggan Paling Loyal
          </h2>
          <span className="text-[10px] text-slate-400">Rapor Sewa</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { name: "Dimas Anggara", phone: "085712349988", rentalsCount: 5, totalSpent: 1250000, tag: "Sering Sewa Tenda 4P" },
            { name: "Rian Saputra", phone: "081399887766", rentalsCount: 3, totalSpent: 630000, tag: "Paket Summit Berdua" },
            { name: "Aldi Kurniawan", phone: "082155443322", rentalsCount: 2, totalSpent: 360000, tag: "Pelanggan Baru" },
          ].map((c, i) => (
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
    </div>
  );
}
