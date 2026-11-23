"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export default function DashboardPage() {
  const { currentUser } = useApp();

  // 2 Dedicated Roles: Admin (Owner & Pengelola Toko) & Customer (Pendaki / Penyewa)
  if (currentUser.role === "admin") {
    return <AdminDashboard />;
  }

  return <CustomerDashboard />;
}
