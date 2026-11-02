"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Shield,
  UserCheck,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole, User } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, setCurrentUser, notify, demoUsers } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick 1-Click Login for Demo/Evaluation
  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    setErrorMessage(null);

    const user = demoUsers.find((u) => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword("Password123!");
      switchUser(role);

      setTimeout(() => {
        notify(`Selamat datang, ${user.name}! Masuk sebagai ${role.toUpperCase()}`, "success");
        router.push("/dashboard");
      }, 500);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Silakan masukkan email dan password Anda.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (!error && data?.user) {
        // Ambil profil dari Supabase
        const { data: profile } = await (supabase as any)
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const role = (profile?.role as UserRole) || "customer";
        const loggedInUser: User = {
          id: data.user.id,
          name: profile?.full_name || data.user.email?.split("@")[0] || "User",
          email: data.user.email || "",
          phoneWa: profile?.phone_wa || "",
          role: role,
        };
        setCurrentUser(loggedInUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("triva_current_user", JSON.stringify(loggedInUser));
        }

        notify(`Login berhasil! Selamat datang, ${profile?.full_name || data.user.email}`, "success");
        router.push("/dashboard");
        return;
      }

      // Jika gagal di Supabase, coba fallback demo user
      const matchedUser = demoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (matchedUser) {
        switchUser(matchedUser.role);
        notify(`Login berhasil! Selamat datang, ${matchedUser.name}`, "success");
        router.push("/dashboard");
        return;
      }

      setErrorMessage(error?.message || "Email atau password salah.");
    } catch (err: any) {
      console.error("Login exception:", err);
      const matchedUser = demoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (matchedUser) {
        switchUser(matchedUser.role);
        notify(`Login berhasil! Selamat datang, ${matchedUser.name}`, "success");
        router.push("/dashboard");
      } else {
        setErrorMessage("Gagal menghubungkan ke server login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-3 flex items-center justify-center drop-shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/triva-logo.png"
              alt="TRIVA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            TRIVA <span className="text-triva-crimson">OUTDOOR</span>
          </h2>
          <p className="text-xs font-bold tracking-widest text-triva-crimson uppercase mt-1">
            Style on the Trail &bull; Portal Masuk
          </p>
        </div>

        {/* Card Container */}
        <div className="mt-6 bg-white py-6 px-5 sm:px-8 shadow-xl rounded-3xl border border-slate-200">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login Standar */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: pendaki@triva.id"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full text-xs pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-triva-crimson text-white text-xs font-bold shadow-md shadow-triva-crimson/25 hover:bg-triva-crimson-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Switcher Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-triva-amber" />
              <span>Login Instan 1-Klik (Uji Coba Demo):</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="w-full p-2.5 rounded-xl border border-triva-crimson-200 bg-triva-crimson-50/60 hover:bg-triva-crimson-100 flex items-center justify-between text-left transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-triva-crimson text-white flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-triva-crimson">
                      Rifki (Owner / Admin)
                    </div>
                    <div className="text-[10px] text-slate-500">owner@triva.id &bull; Laporan Omset</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-triva-crimson bg-white px-2 py-0.5 rounded-md border border-triva-crimson-200">
                  Masuk &rarr;
                </span>
              </button>

              {/* Staff Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin("staff")}
                className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 flex items-center justify-between text-left transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900">
                      Arifin (Staf Kasir)
                    </div>
                    <div className="text-[10px] text-slate-500">staff@triva.id &bull; Serah Terima & KTP</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                  Masuk &rarr;
                </span>
              </button>

              {/* Customer Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin("customer")}
                className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 flex items-center justify-between text-left transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-900">
                      Dimas Anggara (Konsumen / Pendaki)
                    </div>
                    <div className="text-[10px] text-slate-500">dimas.hiker@gmail.com &bull; Sewa Mandiri</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                  Masuk &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Belum punya akun penyewa?{" "}
            <Link
              href="/register"
              className="font-bold text-triva-crimson hover:underline"
            >
              Daftar Sebagai Konsumen Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
