"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StaffDashboard from "@/components/dashboard/StaffDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export default function DashboardPage() {
  const { currentUser } = useApp();

  // Dynamically render the dedicated UI view according to the active user role
  if (currentUser.role === "admin") {
    return <AdminDashboard />;
  }

  if (currentUser.role === "staff") {
    return <StaffDashboard />;
  }

  return <CustomerDashboard />;
}
