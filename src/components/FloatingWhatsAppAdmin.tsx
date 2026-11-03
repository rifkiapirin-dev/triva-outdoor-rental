"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.031 2C6.512 2 2.016 6.49 2.016 12c0 1.954.564 3.784 1.542 5.336L2 22l4.823-1.52A9.957 9.957 0 0 0 12.031 22c5.52 0 10.016-4.49 10.016-10s-4.496-10-10.016-10zm0 18.234a8.216 8.216 0 0 1-4.225-1.168l-.303-.18-2.862.902.919-2.791-.197-.313a8.204 8.204 0 0 1-1.282-4.444c0-4.544 3.698-8.24 8.24-8.24 4.543 0 8.24 3.696 8.24 8.24 0 4.544-3.697 8.24-8.24 8.24zm4.516-6.175c-.247-.124-1.463-.722-1.69-.805-.226-.082-.391-.124-.556.124-.165.248-.639.805-.783.97-.144.165-.288.185-.535.062-.247-.124-1.043-.385-1.986-1.226-.734-.655-1.23-1.464-1.374-1.711-.144-.247-.015-.381.108-.504.112-.11.247-.288.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.556-1.34-.762-1.835-.2-.484-.403-.418-.556-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.226.247-.865.845-.865 2.062 0 1.216.886 2.391 1.01 2.556.124.165 1.745 2.664 4.228 3.738.591.256 1.053.409 1.413.523.594.188 1.134.162 1.561.098.477-.071 1.463-.598 1.669-1.175.206-.577.206-1.072.144-1.175-.062-.103-.226-.165-.473-.288z" />
    </svg>
  );
}

export default function FloatingWhatsAppAdmin() {
  const { settings, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [complaintText, setComplaintText] = useState("");

  const storePhone = settings?.storePhoneWa || "6283851284143";
  const cleanPhone = storePhone.replace(/[^0-9]/g, "").replace(/^0/, "62");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const defaultMsg =
      `Halo Admin *${settings?.storeName || "TRIVA Outdoor"}*,\n` +
      `Saya *${currentUser?.name && currentUser.name !== "Tamu" ? currentUser.name : "Pelanggan"}* (${currentUser?.phoneWa || "Penyewa"}).\n\n` +
      `Ada kendala / keluhan / pertanyaan mengenai layanan sewa alat:\n` +
      `"${complaintText.trim() ? complaintText.trim() : "Halo Admin, saya ingin menanyakan perihal sewa alat / komplain layanan."}"\n\n` +
      `Mohon bantuannya ya min. Terima kasih!`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setComplaintText("");
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* 1. Popup Mini Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[310px] sm:w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-2">
          {/* Header WhatsApp Hijau */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-700 rounded-full" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                  <span>Customer Care TRIVA</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">24/7</span>
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span>Admin Siap Melayani &bull; Respon Cepat</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Pesan */}
          <div className="p-4 space-y-3 bg-slate-50/70 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="font-bold text-slate-800 text-[11px] block">
                👋 Halo Pendaki! Ada yang bisa kami bantu?
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Punya pertanyaan ketersediaan alat, jadwal sewa, kendala di basecamp, atau keluhan layanan? Sampaikan langsung ke tim Admin kami.
              </p>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pilihan Cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Kendala Serah Terima Alat",
                  "Konfirmasi Pembayaran DP",
                  "Perpanjang Durasi Sewa",
                  "Klaim Garansi / Penggantian",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setComplaintText(chip)}
                    className="text-[10px] font-semibold bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 px-2.5 py-1 rounded-lg text-slate-700 transition-all text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="space-y-2 pt-1">
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Tulis kendala, keluhan, atau pertanyaan Anda..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-950/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim ke WhatsApp Admin</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Floating Circular WhatsApp Button */}
      <div className="relative group">
        {/* Tooltip Hover (Hanya jika chatbox tertutup) */}
        {!isOpen && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span>Ada Keluhan atau Pertanyaan? Chat Admin</span>
            <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 relative ${
            isOpen
              ? "bg-slate-800 rotate-90 scale-95"
              : "bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:scale-110 active:scale-95 shadow-emerald-600/40 hover:shadow-emerald-600/60"
          }`}
          title="Bantuan WhatsApp Admin"
          aria-label="Buka Chat WhatsApp Admin"
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <>
              <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md" />
              {/* Online pulse glow ring */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
