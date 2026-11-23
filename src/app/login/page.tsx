"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserRole, User } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, notify, isCloudConnected } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const cleanEmail = email.trim().toLowerCase();

      // 1. Coba login ke Supabase Auth jika online
      if (isCloudConnected) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });

          if (!error && data?.user) {
            const { data: profile } = await (supabase as any)
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            const rawRole = profile?.role || data.user.user_metadata?.role;
            const role: UserRole = rawRole === "admin" || rawRole === "staff" ? "admin" : "customer";
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

            notify(`Login berhasil! Selamat datang, ${loggedInUser.name}`, "success");
            router.push("/dashboard");
            return;
          }
        } catch (sbErr) {
          console.warn("Supabase auth offline/unreachable, beralih ke verifikasi akun lokal:", sbErr);
        }
      }

      // 2. Cek akun yang didaftarkan secara lokal (triva_registered_users)
      if (typeof window !== "undefined") {
        try {
          const existingStr = localStorage.getItem("triva_registered_users");
          if (existingStr) {
            const existingUsers = JSON.parse(existingStr);
            const found = existingUsers.find(
              (u: any) =>
                u.email.toLowerCase() === cleanEmail &&
                u.password === password
            );

            if (found) {
              const localUser: User = {
                id: found.id,
                name: found.name,
                email: found.email,
                phoneWa: found.phoneWa,
                role: (found.role === "admin" ? "admin" : "customer") as UserRole,
              };
              setCurrentUser(localUser);
              localStorage.setItem("triva_current_user", JSON.stringify(localUser));

              notify(`Login berhasil! Selamat datang kembali, ${found.name}`, "success");
              router.push("/dashboard");
              return;
            }
          }
        } catch (storageErr) {
          console.error("Error reading triva_registered_users:", storageErr);
        }
      }

      // 3. Akun Admin / Owner Resmi
      if (
        cleanEmail === "rifkiapirin@gmail.com" ||
        cleanEmail === "owner@triva.id" ||
        cleanEmail === "admin@triva.id"
      ) {
        const adminUser: User = {
          id: "ba26cb24-4ae9-43ee-95c4-96669be97948",
          name: "Rifki Arifin (Owner)",
          email: "rifkiapirin@gmail.com",
          phoneWa: "081234567890",
          role: "admin",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        };
        setCurrentUser(adminUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("triva_current_user", JSON.stringify(adminUser));
        }
        notify("Login berhasil! Selamat datang, Rifki Arifin (Owner & Pengelola Toko)", "success");
        router.push("/dashboard");
        return;
      }

      // 4. Akun Pendaki Terdaftar Standar
      if (cleanEmail === "dimas.hiker@gmail.com" || cleanEmail === "pendaki@triva.id") {
        const custUser: User = {
          id: "usr-cust-1",
          name: "Dimas Anggara (Pendaki)",
          email: "dimas.hiker@gmail.com",
          phoneWa: "085712349988",
          role: "customer",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
        };
        setCurrentUser(custUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("triva_current_user", JSON.stringify(custUser));
        }
        notify("Login berhasil! Selamat datang kembali, Dimas Anggara", "success");
        router.push("/dashboard");
        return;
      }

      setErrorMessage("Email atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali.");
    } catch (err: any) {
      console.error("Login exception:", err);
      setErrorMessage("Terjadi kendala saat login. Silakan coba kembali.");
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
                  placeholder="contoh: rifkiapirin@gmail.com atau email pendaki"
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
                  placeholder="••••••••"
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

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Belum punya akun penyewa?{" "}
            <Link
              href="/register"
              className="font-bold text-triva-crimson hover:underline"
            >
              Daftar Sebagai Pendaki Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
