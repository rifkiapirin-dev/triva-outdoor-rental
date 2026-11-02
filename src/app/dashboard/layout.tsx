"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import ModalNewRental from "@/components/ModalNewRental";
import FloatingCartBar from "@/components/cart/FloatingCartBar";
import CartDrawer from "@/components/cart/CartDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* 1. Desktop & Mobile Drawer Sidebar */}
      <Sidebar />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-36 lg:pb-12">
          {children}
        </main>
      </div>

      {/* 3. ShopeeFood/GoFood Style Floating Cart Bar & Drawer */}
      <FloatingCartBar />
      <CartDrawer />

      {/* 4. Mobile Bottom Navigation (Only visible on screens < 1024px) */}
      <BottomNav />

      {/* 5. Global Modals */}
      <ModalNewRental />
    </div>
  );
}
