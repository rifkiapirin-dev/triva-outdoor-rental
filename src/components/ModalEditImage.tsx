"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Check,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

// Curated high quality presets per category for quick admin selection
const PRESETS_BY_CATEGORY: Record<string, { label: string; url: string }[]> = {
  tenda: [
    { label: "Tenda Dome Oranye Puncak", url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80" },
    { label: "Tenda Kuning Camping Gunung", url: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&auto=format&fit=crop&q=80" },
    { label: "Tenda Hijau Hutan Pinus", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80" },
    { label: "Tenda Ultralight Silnylon", url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80" },
    { label: "Tenda Badai Salju Ekspedisi", url: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=600&auto=format&fit=crop&q=80" },
  ],
  carrier: [
    { label: "Carrier Merah 65L", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=80" },
    { label: "Carrier Biru 60L", url: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&auto=format&fit=crop&q=80" },
    { label: "Carrier Vintage Cordura", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80" },
    { label: "Backpack Gunung 70L", url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&auto=format&fit=crop&q=80" },
    { label: "Ransel Ekspedisi Berat", url: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop&q=80" },
  ],
  sepatu: [
    { label: "Sepatu Hiking Waterproof", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
    { label: "Sepatu Trail Runner Gore-Tex", url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80" },
    { label: "Sepatu Trekking Cokelat", url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80" },
    { label: "Sepatu Gunung High Ankle", url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80" },
  ],
  celana: [
    { label: "Celana Cargo Khaki Trekking", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80" },
    { label: "Celana Lapangan Quickdry Arei", url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80" },
    { label: "Celana Waterproof Hardshell", url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80" },
    { label: "Celana Polar Thermal Hangat", url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80" },
    { label: "Celana Ripstop Tactical", url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80" },
  ],
  "alat-masak": [
    { label: "Kompor Portable & Panci", url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&auto=format&fit=crop&q=80" },
    { label: "Cooking Set Nesting Camp", url: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=600&auto=format&fit=crop&q=80" },
    { label: "Teko Camping Ultralight", url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80" },
    { label: "Panggangan Portable BBQ", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" },
  ],
  jaket: [
    { label: "Jaket Waterproof Eiger Hijau", url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80" },
    { label: "Down Jacket Bulu Angsa Puffer", url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80" },
    { label: "Windbreaker Ultralight Packable", url: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80" },
    { label: "Jaket Hardshell Merah Summit", url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80" },
  ],
  aksesoris: [
    { label: "Headlamp USB Rechargeable", url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80" },
    { label: "Trekking Pole Duralumin", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80" },
    { label: "Sleeping Bag Bulu Angsa", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80" },
    { label: "Matras Foil Reflektif", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80" },
  ],
};

export default function ModalEditImage() {
  const {
    editingTarget,
    setEditingTarget,
    updateItemImage,
    updateCategoryImage,
    currentUser,
    notify,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (editingTarget) {
      setPreviewUrl(editingTarget.currentImageUrl || "");
      setUrlInput(editingTarget.currentImageUrl || "");
    }
  }, [editingTarget]);

  // Only Admin can open this modal
  if (!editingTarget || currentUser.role !== "admin") return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar yang valid (.png, .jpg, .jpeg, .webp)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewUrl) {
      alert("Pilih atau masukkan gambar terlebih dahulu.");
      return;
    }

    if (editingTarget.type === "item") {
      updateItemImage(editingTarget.id, previewUrl);
      notify(`Foto produk "${editingTarget.name}" berhasil disimpan permanen ke server!`, "success");
    } else {
      updateCategoryImage(editingTarget.id, previewUrl);
      notify(`Foto kategori "${editingTarget.name}" berhasil disimpan permanen ke server!`, "success");
    }

    setEditingTarget(null);
  };

  const categoryKey = editingTarget.categorySlug || "tenda";
  const presets = PRESETS_BY_CATEGORY[categoryKey] || PRESETS_BY_CATEGORY["tenda"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Khusus Admin &bull; Ubah Gambar Manual</span>
              </div>
              <h2 className="text-sm font-black tracking-tight line-clamp-1">
                {editingTarget.type === "item" ? "Produk: " : "Kategori: "}
                {editingTarget.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setEditingTarget(null)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Live Preview Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block">
              Pratinjau Foto Baru:
            </label>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center shadow-inner">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="text-center text-slate-400 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-50" />
                  <span className="text-xs block">Belum ada gambar yang dipilih</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "upload"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "url"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "presets"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galeri Siap</span>
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === "upload" && (
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors text-center space-y-2">
              <Upload className="w-8 h-8 mx-auto text-slate-400" />
              <div className="text-xs text-slate-600">
                <label className="font-extrabold text-triva-crimson hover:underline cursor-pointer">
                  Klik untuk pilih file foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  Mendukung file PNG, JPG, JPEG, WEBP dari Laptop atau Galeri HP
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Masukkan URL Gambar:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-triva-crimson"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(urlInput)}
                  className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Tip: Anda dapat menyalin link gambar dari Unsplash, Pexels, atau sumber web lainnya.
              </p>
            </div>
          )}

          {/* Tab 3: Curated Presets */}
          {activeTab === "presets" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Pilih Foto Sesuai Kategori:
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {presets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewUrl(preset.url)}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                      previewUrl === preset.url
                        ? "border-triva-crimson bg-rose-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 line-clamp-2 leading-tight">
                      {preset.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingTarget(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white text-xs font-black shadow-md shadow-triva-crimson/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Foto Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}