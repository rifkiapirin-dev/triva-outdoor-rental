"use client";

import React, { useState } from "react";
import { RentalTransaction, PaymentMethod } from "@/types";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  CreditCard,
  QrCode,
  Banknote,
  AlertTriangle,
  Tent,
} from "lucide-react";

interface ModalHandoverSettlementProps {
  rental: RentalTransaction | null;
  onClose: () => void;
  onConfirm: (rentalId: string, pelunasanMethod: PaymentMethod) => void;
}

export default function ModalHandoverSettlement({
  rental,
  onClose,
  onConfirm,
}: ModalHandoverSettlementProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [isKtpChecked, setIsKtpChecked] = useState(true);
  const [isConditionChecked, setIsConditionChecked] = useState(true);

  if (!rental) return null;

  const hasRemaining = rental.remainingAmount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKtpChecked) {
      alert("Wajib memastikan KTP fisik asli telah diterima untuk disimpan di brankas toko!");
      return;
    }
    if (!isConditionChecked) {
      alert("Wajib memeriksa kondisi fisik unit perlengkapan bersama penyewa!");
      return;
    }
    onConfirm(rental.id, selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-rose-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-rose-300">
                Meja Kasir &bull; Pengambilan Barang
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {hasRemaining ? "Pelunasan Sisa & Serah Terima Alat" : "Serah Terima Alat di Toko"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Booking Info Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Kode Booking &bull; Penyewa
              </span>
              <span className="font-mono font-black text-sm text-slate-900 block">
                {rental.bookingCode}
              </span>
              <span className="text-slate-700 font-bold block mt-0.5">
                {rental.customerName} ({rental.customerPhone})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Jadwal</span>
              <span className="font-bold text-slate-800 block">{rental.durationDays} Hari Sewa</span>
              <span className="text-[10px] text-slate-500 block">
                {rental.startDate} s/d {rental.endDate}
              </span>
            </div>
          </div>

          {/* List Peralatan Singkat */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Daftar Alat yang Diambil ({rental.items.length} Unit):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50/80 rounded-xl border border-slate-100">
              {rental.items.map((it) => (
                <div
                  key={it.itemId}
                  className="p-1.5 bg-white rounded-lg border border-slate-200/80 flex items-center gap-1.5 text-[11px]"
                >
                  <Tent className="w-3.5 h-3.5 text-triva-crimson shrink-0" />
                  <span className="font-mono font-bold text-slate-900 text-[10px] bg-slate-100 px-1 rounded">
                    {it.unitCode}
                  </span>
                  <span className="truncate font-semibold text-slate-700">{it.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Finansial & Sisa Pelunasan */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between text-slate-600">
              <span>Total Biaya Sewa:</span>
              <span className="font-bold text-slate-900">
                Rp {rental.totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between text-emerald-700">
              <span>DP Dibayar Awal ({rental.paymentMethod.toUpperCase()}):</span>
              <span className="font-bold">
                ✓ Rp {rental.downPayment.toLocaleString("id-ID")} (Lunas)
              </span>
            </div>
            <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-black text-amber-950 block text-xs">
                  {hasRemaining ? "Sisa Wajib Dilunasi Sekarang:" : "Status Pembayaran:"}
                </span>
                <span className="text-[10px] text-amber-800">
                  {hasRemaining
                    ? "Dilunasi saat pengambilan barang di kasir toko"
                    : "Sudah lunas penuh 100% di awal"}
                </span>
              </div>
              <span
                className={`text-base font-black ${
                  hasRemaining ? "text-triva-crimson" : "text-emerald-700"
                }`}
              >
                {hasRemaining
                  ? `Rp ${rental.remainingAmount.toLocaleString("id-ID")}`
                  : "✓ LUNAS (Rp 0)"}
              </span>
            </div>
          </div>

          {/* Metode Pelunasan (Jika Masih Ada Sisa Tagihan) */}
          {hasRemaining && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                Metode Pembayaran Pelunasan di Kasir:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("cash")}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === "cash"
                      ? "border-triva-crimson bg-rose-50/60 text-triva-crimson font-black ring-2 ring-triva-crimson/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[11px]">Tunai / Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("qris")}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === "qris"
                      ? "border-triva-crimson bg-rose-50/60 text-triva-crimson font-black ring-2 ring-triva-crimson/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">QRIS Toko</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("transfer")}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedMethod === "transfer"
                      ? "border-triva-crimson bg-rose-50/60 text-triva-crimson font-black ring-2 ring-triva-crimson/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Transfer / EDC</span>
                </button>
              </div>
            </div>
          )}

          {/* Checklist Wajib Serah Terima */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isKtpChecked}
                onChange={(e) => setIsKtpChecked(e.target.checked)}
                className="mt-0.5 rounded text-triva-crimson focus:ring-triva-crimson h-4 w-4"
              />
              <span className="text-[11px] text-slate-800 font-semibold">
                <strong>{rental.idCardType} Asli</strong> penyewa sudah diterima fisik dan disimpan di brankas toko TRIVA sebagai jaminan.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isConditionChecked}
                onChange={(e) => setIsConditionChecked(e.target.checked)}
                className="mt-0.5 rounded text-triva-crimson focus:ring-triva-crimson h-4 w-4"
              />
              <span className="text-[11px] text-slate-800 font-semibold">
                Kondisi kelengkapan dan kebersihan unit telah diperiksa bersama penyewa sebelum diserahkan.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-black text-xs shadow-md shadow-triva-crimson/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {hasRemaining
                  ? `Terima Rp ${rental.remainingAmount.toLocaleString("id-ID")} & Serahkan Alat`
                  : "Serahkan Alat & Aktifkan Sewa"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
