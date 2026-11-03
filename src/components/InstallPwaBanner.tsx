"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share2, PlusSquare, Smartphone, Check } from "lucide-react";

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Cek apakah sudah terinstall / dibuka sebagai aplikasi standalone
    if (typeof window !== "undefined") {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      // Cek apakah perangkat iOS
      const ua = window.navigator.userAgent.toLowerCase();
      const isIphoneOrIpad = /iphone|ipad|ipod/.test(ua);
      setIsIos(isIphoneOrIpad);

      // Cek apakah user pernah dismiss banner hari ini
      const dismissedTime = localStorage.getItem("triva_pwa_dismissed");
      if (dismissedTime && Date.now() - Number(dismissedTime) < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }

      // 2. Tangkap event beforeinstallprompt (Android / Chrome)
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  // Jika sudah dibuka sebagai aplikasi mandiri atau di-dismiss, jangan tampilkan
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chrome PWA install dialog
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      // iOS Safari guide
      setShowIosGuide(true);
    } else {
      // Fallback petunjuk
      alert(
        "Untuk menginstall TRIVA di HP:\n1. Buka menu browser (titik 3 di kanan atas)\n2. Pilih 'Tambahkan ke Layar Utama' (Add to Home Screen)\n3. Aplikasi TRIVA akan langsung terpasang di HP Anda!"
      );
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("triva_pwa_dismissed", Date.now().toString());
    }
  };

  return (
    <>
      {/* Mini Floating Pill Install Prompt on Mobile (di atas bottom nav) */}
      <div className="fixed bottom-20 left-4 z-40 max-w-[280px] sm:max-w-xs animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-triva-crimson shrink-0 flex items-center justify-center p-1 border border-white/20">
            <Image
              src="/icon-192.png"
              alt="TRIVA"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-[11px] font-black text-white truncate leading-tight">
              Aplikasi HP TRIVA
            </h4>
            <p className="text-[9px] text-slate-300 truncate">
              Pasang di layar utama HP Anda
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <Download className="w-3 h-3" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* iOS Modal Petunjuk Tambahkan ke Layar Utama */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-triva-crimson flex items-center justify-center text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Pasang di iPhone / iPad
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Hanya butuh 2 langkah mudah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Ketuk tombol Bagikan (Share)
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    Ikon kotak berpanah ke atas <Share2 className="w-3.5 h-3.5 inline text-blue-500" /> di bilah bawah browser Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    Pilih &quot;Tambahkan ke Layar Utama&quot;
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    Pilih menu <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" /> &quot;Add to Home Screen&quot;.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Saya Mengerti</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
