"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Tent,
  Receipt,
  BarChart3,
  Shield,
  UserCheck,
  Compass,
  PlusCircle,
  X,
  LogOut,
  History,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "active";
  const {
    currentUser,
    isMobileMenuOpen,
    closeMobileMenu,
    setShowNewRentalModal,
    rentals,
    logout,
  } = useApp();

  const userRentals = rentals.filter((r) => {
    if (currentUser.role === "customer" && r.customerId !== currentUser.id) return false;
    return true;
  });

  const activeRentalsCount = userRentals.filter(
    (r) => r.status === "pending_dp" || r.status === "confirmed" || r.status === "active"
  ).length;

  const pendingCount = rentals.filter((r) => r.status === "pending_dp").length;

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Katalog & Stok", href: "/dashboard/catalog", icon: Tent },
    {
      label: currentUser.role === "customer" ? "Sewa Saya (Aktif)" : "Kasir & Sewa Berjalan",
      href: "/dashboard/rentals?view=active",
      icon: Receipt,
      badge:
        currentUser.role === "customer"
          ? activeRentalsCount > 0
            ? `${activeRentalsCount} aktif`
            : undefined
          : pendingCount > 0
          ? `${pendingCount} baru`
          : undefined,
    },
    {
      label: "Riwayat Transaksi",
      href: "/dashboard/rentals?view=history",
      icon: History,
    },
    ...(currentUser.role === "admin"
      ? [{ label: "Laporan Omset", href: "/dashboard/reports", icon: BarChart3 }]
      : []),
  ];

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full bg-white">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link
            href="/dashboard"
            onClick={() => isMobile && closeMobileMenu()}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform duration-300">
              <Image src="/triva-logo.png" alt="TRIVA Logo" fill className="object-contain" priority />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-slate-900 group-hover:text-triva-crimson transition-colors leading-tight">
                TRIVA OUTDOOR
              </div>
              <div className="text-[10px] font-bold tracking-wider text-triva-crimson uppercase mt-0.5">
                Style on the Trail
              </div>
            </div>
          </Link>
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current User Card */}
        <div className="p-3 mx-4 my-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-triva-crimson/10 text-triva-crimson font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              {currentUser.role === "admin" && <Shield className="w-3 h-3 text-triva-crimson" />}
              {currentUser.role === "staff" && <UserCheck className="w-3 h-3 text-amber-600" />}
              {currentUser.role === "customer" && <Compass className="w-3 h-3 text-blue-600" />}
              <span>{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 mb-3">
          <button
            onClick={() => {
              setShowNewRentalModal(true);
              if (isMobile) closeMobileMenu();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-triva-crimson text-white text-xs font-bold shadow-md shadow-triva-crimson/25 hover:bg-triva-crimson-700 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sewa Baru / Booking</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.href.includes("?")
              ? pathname === "/dashboard/rentals" &&
                (item.href.includes("view=history")
                  ? currentView === "history"
                  : currentView === "active")
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && closeMobileMenu()}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-triva-crimson-50 text-triva-crimson font-bold shadow-sm border border-triva-crimson-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-triva-crimson" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            type="button"
            onClick={async () => {
              if (isMobile) closeMobileMenu();
              await logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors mt-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-slate-100 text-center">
        <div className="text-[10px] text-slate-400">
          TRIVA &bull; Style on the Trail &bull; v1.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (Only visible on lg: 1024px and up) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between h-screen sticky top-0 z-30 select-none shrink-0">
        {renderContent(false)}
      </aside>

      {/* 2. Mobile Drawer Sidebar (Sliding drawer on small screens) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside
            className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between select-none z-10 animate-in slide-in-from-left duration-200"
            role="dialog"
            aria-modal="true"
          >
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0" />}>
      <SidebarContent />
    </Suspense>
  );
}
