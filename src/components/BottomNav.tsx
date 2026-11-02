"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Tent, Plus, Receipt, History, Compass, BarChart3 } from "lucide-react";
import { useApp } from "@/context/AppContext";

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "active";
  const { currentUser, setShowNewRentalModal, rentals } = useApp();

  const userRentals = rentals.filter((r) => {
    if (currentUser.role === "customer" && r.customerId !== currentUser.id) return false;
    return true;
  });

  const activeRentalsCount = userRentals.filter(
    (r) => r.status === "pending_dp" || r.status === "confirmed" || r.status === "active"
  ).length;

  const isRentalsPage = pathname === "/dashboard/rentals";
  const isActiveViewActive = isRentalsPage && currentView === "active";
  const isHistoryViewActive = isRentalsPage && currentView === "history";

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

        {/* Tab 4: Sewa Saya / Sewa Aktif (Berjalan) */}
        <Link
          href="/dashboard/rentals?view=active"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            isActiveViewActive
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${isActiveViewActive ? "text-triva-crimson" : "text-slate-400"}`} />
            {activeRentalsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-triva-crimson text-white rounded-full text-[8px] font-black flex items-center justify-center">
                {activeRentalsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {currentUser.role === "customer" ? "Sewa Saya" : "Kasir"}
          </span>
        </Link>

        {/* Tab 5: Riwayat Transaksi */}
        <Link
          href="/dashboard/rentals?view=history"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isHistoryViewActive
              ? "text-triva-crimson font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History className={`w-5 h-5 ${isHistoryViewActive ? "text-triva-crimson" : "text-slate-400"}`} />
          <span className="text-[10px] mt-1 tracking-tight">Riwayat</span>
        </Link>
      </div>
    </nav>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
