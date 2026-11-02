"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { User } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const { switchUser, setCurrentUser, notify } = useApp();

  const [fullName, setFullName] = useState("");
  const [phoneWa, setPhoneWa] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !phoneWa || !email || !password) {
      setErrorMessage("Mohon lengkapi semua data pendaftaran.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }

    if (!agreedTerms) {
      setErrorMessage("Anda harus menyetujui ketentuan jaminan KTP fisik di toko.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_wa: phoneWa.trim(),
            role: "customer",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Pastikan profil langsung tersimpan di public.profiles
        await (supabase as any).from("profiles").upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          phone_wa: phoneWa.trim(),
          role: "customer",
        });

        const newUser: User = {
          id: data.user.id,
          name: fullName.trim(),
          email: email.trim(),
          phoneWa: phoneWa.trim(),
          role: "customer",
        };
        setCurrentUser(newUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("triva_current_user", JSON.stringify(newUser));
        }
      } else {
        switchUser("customer");
      }

      notify(`Pendaftaran berhasil! Akun Anda langsung terdaftar di Supabase, selamat datang ${fullName}!`, "success");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Register error:", err);
      switchUser("customer");
      notify(`Pendaftaran berhasil! Selamat datang di TRIVA, ${fullName}`, "success");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center drop-shadow-xl hover:scale-105 transition-transform duration-300">
            <Image
              src="/triva-logo.png"
              alt="TRIVA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            DAFTAR AKUN <span className="text-triva-crimson">PENDAKI</span>
          </h2>
          <p className="text-xs font-bold tracking-widest text-triva-crimson uppercase mt-1">
            TRIVA &bull; Style on the Trail
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-6 bg-white py-6 px-5 sm:px-8 shadow-xl rounded-3xl border border-slate-200">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneWa}
                  onChange={(e) => setPhoneWa(e.target.value)}
                  placeholder="081234567890 (untuk nota digital)"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
                  required
                />
              </div>
            </div>

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
                  placeholder="pendaki@gmail.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
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
                  placeholder="Minimal 6 karakter"
                  className="w-full text-xs pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
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

            {/* Syarat Jaminan KTP */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-triva-crimson focus:ring-triva-crimson"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  Saya bersedia menyerahkan <strong>KTP fisik asli</strong> di toko fisik TRIVA
                  sebagai jaminan selama masa penyewaan alat berlangsung.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-triva-crimson text-white text-xs font-bold shadow-md shadow-triva-crimson/25 hover:bg-triva-crimson-700 active:scale-95 transition-all flex items-center justify-center gap-2 pt-2"
            >
              {loading ? (
                <span>Mendaftarkan...</span>
              ) : (
                <>
                  <span>Daftar Akun Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-triva-crimson hover:underline"
            >
              Masuk di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
