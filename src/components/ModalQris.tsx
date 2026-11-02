"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, QrCode, ShieldCheck, Download } from "lucide-react";

export default function ModalQris() {
  const { showQrisModal, setShowQrisModal, settings } = useApp();

  if (!showQrisModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
        {/* Close Button */}
        <button
          onClick={() => setShowQrisModal(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* QRIS Header */}
        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-triva-crimson-50 text-triva-crimson text-[10px] font-bold tracking-wider uppercase mb-2">
            <QrCode className="w-3.5 h-3.5" />
            Pembayaran QRIS Nasional
          </div>
          <h3 className="font-extrabold text-base text-slate-900">{settings.storeName}</h3>
          <p className="text-xs text-slate-500">Scan via GoPay, OVO, Dana, BCA, Mandiri, dll.</p>
        </div>

        {/* Simulated QR Box */}
        <div className="mx-auto w-56 h-56 p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md flex flex-col items-center justify-center relative">
          {/* Simulated QR Pattern */}
          <div className="w-full h-full bg-slate-100 rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden">
            <div className="absolute inset-2 grid grid-cols-6 grid-rows-6 gap-1 opacity-80">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    i % 2 === 0 || i % 5 === 0 ? "bg-slate-900" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            {/* Center Logo */}
            <div className="z-10 bg-triva-crimson text-white px-2 py-1 rounded font-extrabold text-[10px] tracking-widest shadow-md">
              TRIVA
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          NMID: ID1026008899001 &bull; A.N. TRIVA OUTDOOR
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowQrisModal(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
