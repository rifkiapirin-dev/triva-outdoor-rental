"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RentalTransaction } from "@/types";
import { X, Printer, Share2, Copy, CheckCircle2, Shield, Calendar, Clock, ShoppingBag } from "lucide-react";

interface ModalReceiptProps {
  rental: RentalTransaction | null;
  onClose: () => void;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
}

export default function ModalReceipt({
  rental,
  onClose,
  storeName = "TRIVA OUTDOOR RENTAL",
  storePhone = "0838-5128-4143",
  storeAddress = "Jl. Kaliurang KM 9, Sleman, D.I. Yogyakarta",
}: ModalReceiptProps) {
  const [copied, setCopied] = useState(false);

  if (!rental) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text =
      `*STRUK NOTA DIGITAL TRIVA OUTDOOR*\n\n` +
      `No. Booking: *#${rental.bookingCode}*\n` +
      `Penyewa: *${rental.customerName}* (${rental.customerPhone})\n` +
      `Jadwal: ${rental.startDate} s/d ${rental.endDate} (${rental.durationDays} Hari)\n` +
      `Jaminan Fisik: ${rental.idCardType} Asli\n\n` +
      `Daftar Perlengkapan:\n` +
      rental.items.map((it) => `- ${it.name} (${it.unitCode}) x${it.qty}`).join("\n") +
      `\n\nTotal Biaya: Rp ${rental.totalAmount.toLocaleString("id-ID")}\n` +
      `DP (QRIS): Rp ${rental.downPayment.toLocaleString("id-ID")} (LUNAS)\n` +
      `Sisa Tagihan di Toko: Rp ${rental.remainingAmount.toLocaleString("id-ID")}\n` +
      `Status: ${rental.status.toUpperCase()}\n` +
      `Kasir: ${rental.handledByStaffName || "Kasir Utama"}\n\n` +
      `Terima kasih telah menyewa di ${storeName}!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWa = () => {
    const cleanPhone = rental.customerPhone.replace(/\D/g, "").replace(/^0/, "62");
    const text = encodeURIComponent(
      `*STRUK NOTA RESERVASI DIGITAL - TRIVA OUTDOOR*\n\n` +
      `Halo Kak *${rental.customerName}*,\n` +
      `Berikut adalah rincian nota sewa perlengkapan pendakian Anda:\n\n` +
      `🔖 *Kode Booking:* #${rental.bookingCode}\n` +
      `📅 *Jadwal Sewa:* ${rental.startDate} s/d ${rental.endDate} (${rental.durationDays} Hari Kalender)\n` +
      `🎒 *Daftar Alat:*\n` +
      rental.items.map((it) => `• ${it.name} (${it.unitCode}) x${it.qty}`).join("\n") + "\n\n" +
      `💵 *Rincian Pembayaran:*\n` +
      `- Total Biaya Sewa: Rp ${rental.totalAmount.toLocaleString("id-ID")}\n` +
      `- Uang Muka DP: *Rp ${rental.downPayment.toLocaleString("id-ID")} (LUNAS)* via ${rental.paymentMethod.toUpperCase()}\n` +
      `- Sisa Pembayaran di Kasir: Rp ${rental.remainingAmount.toLocaleString("id-ID")}\n` +
      `- Jaminan Fisik Wajib: ${rental.idCardType} Asli (Disimpan di Brankas Toko)\n\n` +
      `📍 *Lokasi Toko:* ${storeAddress}\n` +
      `⏰ *Batas Pengembalian:* Pukul 21:00 WIB di hari terakhir.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all duration-300 flex flex-col max-h-[92vh]"
      >
        {/* Top Actions Bar (Non-Printable) */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🧾 Struk Nota Resmi</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
              title="Salin isi nota teks"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="receipt-print-area" className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4 bg-white text-slate-900">
          
          {/* Header Brand */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
            <div className="relative w-10 h-10 mx-auto rounded-xl overflow-hidden mb-1">
              <Image src="/triva-logo.png" alt="TRIVA" fill className="object-contain" />
            </div>
            <h2 className="font-sans font-black text-base text-slate-950 tracking-tight">
              {storeName}
            </h2>
            <p className="text-[10px] text-slate-500 font-sans">{storeAddress}</p>
            <p className="text-[10px] text-slate-500 font-sans">WhatsApp Kasir: {storePhone}</p>
            
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-md font-mono text-xs font-black tracking-wider text-slate-900 border border-slate-200">
                NO. BOOKING: #{rental.bookingCode}
              </span>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu Transaksi:</span>
              <span className="font-bold text-slate-800">
                {rental.createdAt ? new Date(rental.createdAt).toLocaleString("id-ID") : rental.startDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Penyewa:</span>
              <span className="font-black text-slate-900">{rental.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">No. WhatsApp:</span>
              <span className="font-bold text-slate-800">{rental.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Durasi Sewa:</span>
              <span className="font-bold text-slate-800">
                {rental.startDate} s/d {rental.endDate} ({rental.durationDays} Hari)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jaminan Fisik:</span>
              <span className="font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                {rental.idCardType} Asli
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Petugas Kasir:</span>
              <span className="font-bold text-slate-800">
                {rental.handledByStaffName || "Bambang Wijaya"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Sewa:</span>
              <span className="font-black text-emerald-700 uppercase">
                {rental.status === "pending_dp"
                  ? "MENUNGGU DP"
                  : rental.status === "confirmed"
                  ? "SIAP DIAMBIL"
                  : rental.status === "active"
                  ? "SEDANG DIGUNAKAN"
                  : rental.status === "returned"
                  ? "SELESAI (KTP KEMBALI)"
                  : "DIBATALKAN"}
              </span>
            </div>
          </div>

          {/* Itemized Rental List */}
          <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Alat Pendakian ({rental.items.length})</span>
              <span>Subtotal</span>
            </div>

            {rental.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-[11px] leading-tight">
                <div>
                  <div className="font-bold text-slate-900">
                    {it.name} <span className="text-slate-500 font-normal">x{it.qty}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    [{it.unitCode}] @ Rp {it.pricePerDay.toLocaleString("id-ID")}/hr
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  Rp {(it.pricePerDay * it.qty * rental.durationDays).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-slate-700">
              <span className="font-bold">TOTAL BIAYA SEWA:</span>
              <span className="font-black text-slate-950 text-sm">
                Rp {rental.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Uang Muka (DP via {rental.paymentMethod.toUpperCase()}):</span>
              <span>Rp {rental.downPayment.toLocaleString("id-ID")} (LUNAS)</span>
            </div>
            <div className="flex justify-between font-black">
              <span className={rental.remainingAmount === 0 ? "text-emerald-700" : "text-amber-900"}>
                {rental.remainingAmount === 0 ? "Pelunasan saat Pengambilan:" : "Sisa Pelunasan (Ambil Alat):"}
              </span>
              <span className={rental.remainingAmount === 0 ? "text-emerald-700" : "text-amber-900"}>
                {rental.remainingAmount === 0
                  ? `✓ LUNAS${rental.pelunasanMethod ? ` (${rental.pelunasanMethod.toUpperCase()})` : ""}`
                  : `Rp ${rental.remainingAmount.toLocaleString("id-ID")}`}
              </span>
            </div>
            {rental.status === "returned" && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded">
                <span>Pelunasan di Kasir:</span>
                <span>LUNAS LENGKAP</span>
              </div>
            )}
          </div>

          {/* Security & Return Terms Footer */}
          <div className="text-center text-[10px] text-slate-400 space-y-1 font-sans pt-1">
            <p className="font-bold text-slate-600">*** TERIMA KASIH TELAH MENYEWA DI TRIVA ***</p>
            <p>
              Jaminan KTP Asli disimpan aman di brankas toko dan akan diserahkan kembali saat seluruh unit dikembalikan dalam kondisi bersih &amp; lengkap.
            </p>
            <p className="text-[9px] text-slate-400">
              Batas jam pengembalian adalah pukul 21:00 WIB di hari terakhir jadwal sewa.
            </p>
          </div>

        </div>

        {/* Bottom Actions Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 grid grid-cols-2 gap-2 text-xs font-bold font-sans">
          <button
            type="button"
            onClick={handleShareWa}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-triva-crimson text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Nota</span>
          </button>
        </div>

      </div>
    </div>
  );
}
