"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  Menu,
  Shield,
  UserCheck,
  Compass,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    logout,
    notification,
    toggleMobileMenu,
    setShowNewRentalModal,
  } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          label: "Owner (Admin)",
          bg: "bg-triva-crimson-50 text-triva-crimson border-triva-crimson-200",
          icon: Shield,
        };
      case "staff":
        return {
          label: "Staf Toko",
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: UserCheck,
        };
      case "customer":
        return {
          label: "Konsumen (Penyewa)",
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          icon: Compass,
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const BadgeIcon = badge.icon;

  const getPageTitle = () => {
    if (pathname.includes("/catalog")) return "Katalog & Ketersediaan Alat";
    if (pathname.includes("/rentals")) return "Manajemen Transaksi Sewa";
    if (pathname.includes("/reports")) return "Laporan Omset & CRM";
    return "Dashboard Operasional";
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-triva-crimson-50 border-triva-crimson-200 text-triva-crimson"
            }`}
          >
            {notification.type === "success" && (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            {notification.type === "info" && (
              <Info className="w-4 h-4 text-triva-crimson shrink-0" />
            )}
            <span className="flex-1">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Brand OR Desktop Page Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo */}
            <Link href="/dashboard" className="flex lg:hidden items-center gap-2 group">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden flex items-center justify-center drop-shadow-sm group-hover:scale-105 transition-transform">
                <Image src="/triva-logo.png" alt="TRIVA Logo" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 leading-none">
                  TRIVA
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-triva-crimson tracking-wider uppercase mt-0.5">
                  Outdoor
                </span>
              </div>
            </Link>

            {/* Desktop Breadcrumb / Title */}
            <div className="hidden lg:block">
              <h1 className="text-base font-extrabold text-slate-800 tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-[11px] text-slate-400">
                TRIVA Outdoor Rental &bull; Style on the Trail
              </p>
            </div>
          </div>

          {/* Right: Actions & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Supabase Live Realtime Cloud Indicator */}
            <div
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"
              title="Database Supabase Cloud Terhubung & Live Realtime"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Cloud</span>
            </div>

            {/* Desktop Quick Button */}
            <button
              onClick={() => setShowNewRentalModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-triva-crimson text-white text-xs font-bold shadow-sm hover:bg-triva-crimson-700 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Sewa Baru</span>
            </button>

            {/* User Account & Profile Menu (Terkunci Sesuai Akun Login) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[11px] sm:text-xs font-semibold shadow-sm transition-all active:scale-95 ${badge.bg}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none font-bold">
                  {currentUser.name ? currentUser.name.split(" ")[0] : "Akun"}
                </span>
                <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded bg-white/80 uppercase font-extrabold">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Account Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  {/* User Profile Header */}
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "TR"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-900 text-xs truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {currentUser.email || "Akun Terverifikasi"}
                      </div>
                      <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {currentUser.role === "admin"
                          ? "👑 Owner & Admin"
                          : currentUser.role === "staff"
                          ? "👨‍💼 Staf Kasir Toko"
                          : "⛺ Konsumen / Pendaki"}
                      </span>
                    </div>
                  </div>

                  {/* Account Details */}
                  {currentUser.phoneWa && (
                    <div className="px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100 flex items-center gap-1.5">
                      <span>📱 WhatsApp:</span>
                      <strong className="text-slate-800 font-mono">{currentUser.phoneWa}</strong>
                    </div>
                  )}

                  {/* Logout Action */}
                  <div className="pt-2 px-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setShowRoleDropdown(false);
                        await logout();
                        router.push("/login");
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Keluar Akun (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
