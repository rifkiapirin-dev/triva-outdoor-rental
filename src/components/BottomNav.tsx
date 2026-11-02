"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tent, Plus, Receipt, BarChart3, UserCheck, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, setShowNewRentalModal } = useApp();

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 z-40 px-3 pt-1.5 pb-2.5 sm:pb-2 shadow-xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Tab 1: Beranda */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === "/dashboard"
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/dashboard" ? "text-triva-crimson" : "text-slate-400"}`} />
          <span className="text-[10px] mt-1 tracking-tight">Beranda</span>
        </Link>

        {/* Tab 2: Katalog Alat */}
        <Link
          href="/dashboard/catalog"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === "/dashboard/catalog"
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Tent className={`w-5 h-5 ${pathname === "/dashboard/catalog" ? "text-triva-crimson" : "text-slate-400"}`} />
          <span className="text-[10px] mt-1 tracking-tight">Katalog</span>
        </Link>

        {/* Center Floating Action Button (FAB) */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-5">
          <button
            onClick={() => setShowNewRentalModal(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-triva-crimson to-rose-600 text-white flex items-center justify-center shadow-lg shadow-triva-crimson/40 hover:scale-105 active:scale-95 transition-all"
            title="Catat Sewa Baru / Booking"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] mt-1 font-bold text-triva-crimson">Sewa</span>
        </div>

        {/* Tab 3: Transaksi / Sewa */}
        <Link
          href="/dashboard/rentals"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === "/dashboard/rentals"
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Receipt className={`w-5 h-5 ${pathname === "/dashboard/rentals" ? "text-triva-crimson" : "text-slate-400"}`} />
          <span className="text-[10px] mt-1 tracking-tight">Transaksi</span>
        </Link>

        {/* Tab 4: Laporan (Admin/Staff) / Akun (Customer) */}
        <Link
          href={currentUser.role === "admin" ? "/dashboard/reports" : "/dashboard/rentals"}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === "/dashboard/reports"
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {currentUser.role === "admin" ? (
            <BarChart3 className={`w-5 h-5 ${pathname === "/dashboard/reports" ? "text-triva-crimson" : "text-slate-400"}`} />
          ) : (
            <UserCheck className={`w-5 h-5 ${pathname === "/dashboard/rentals" ? "text-triva-crimson" : "text-slate-400"}`} />
          )}
          <span className="text-[10px] mt-1 tracking-tight">
            {currentUser.role === "admin" ? "Laporan" : "Sewa Saya"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
