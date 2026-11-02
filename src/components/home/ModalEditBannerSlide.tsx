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
  RotateCcw,
  Palette,
  Tag,
  DollarSign,
} from "lucide-react";

export interface ShowcaseSlide {
  id: number;
  categoryPill: string;
  name: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  price: string;
  originalPrice: string;
  selectorLabel: string;
  options: string[];
  imageUrl: string;
  bgGradient: string;
  accentColor: string;
  socialQuote: string;
}

// Preset foto estetis outdoor berkualitas tinggi siap pakai
const CURATED_PRESETS: { label: string; url: string; category: string }[] = [
  // Official TRIVA Uploads
  {
    label: "Jaket TRIVA Hardshell Crimson (Official)",
    url: "/showcase/triva-jacket-crimson-3d.png",
    category: "Jaket",
  },
  {
    label: "Poster TRIVA Cool Styles Nature Vibes (Official)",
    url: "/showcase/triva-poster-cool-styles.jpg",
    category: "Promo",
  },
  {
    label: "Sepatu TRIVA Embossed Leather Rock (Official)",
    url: "/showcase/triva-boots-leather-rock.jpg",
    category: "Sepatu",
  },

  // Jaket & Puffer
  {
    label: "Puffer Jacket Oranye Hangat (Default)",
    url: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80",
    category: "Jaket",
  },
  {
    label: "Down Jacket Hitam Outdoor Puffer",
    url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
    category: "Jaket",
  },
  {
    label: "Jaket Hardshell Merah Summit Ekspedisi",
    url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80",
    category: "Jaket",
  },
  {
    label: "Jaket Waterproof Hijau Forest",
    url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80",
    category: "Jaket",
  },

  // Tenda
  {
    label: "Tenda Dome Oranye Puncak (Default)",
    url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    category: "Tenda",
  },
  {
    label: "Tenda Kuning Ekspedisi Gunung",
    url: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=800&auto=format&fit=crop&q=80",
    category: "Tenda",
  },
  {
    label: "Tenda Hijau Hutan Pinus",
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
    category: "Tenda",
  },
  {
    label: "Tenda Ultralight Silnylon",
    url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80",
    category: "Tenda",
  },

  // Carrier & Ransel
  {
    label: "Carrier Merah 65L (Default)",
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80",
    category: "Carrier",
  },
  {
    label: "Carrier Biru 60L Air Comfort",
    url: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&auto=format&fit=crop&q=80",
    category: "Carrier",
  },
  {
    label: "Carrier Vintage Cordura 50L",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    category: "Carrier",
  },
  {
    label: "Backpack Hiking 70L Ekspedisi",
    url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80",
    category: "Carrier",
  },

  // Sepatu & Gear
  {
    label: "Sepatu Hiking Waterproof Vibram (Default)",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    category: "Sepatu",
  },
  {
    label: "Sepatu Trail Runner Gore-Tex",
    url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80",
    category: "Sepatu",
  },
  {
    label: "Sepatu Trekking Cokelat Nubuck",
    url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
    category: "Sepatu",
  },
  {
    label: "Lentera Vintage & Alat Masak Kopi",
    url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80",
    category: "Camping",
  },
];

// Opsi gradien warna latar belakang
const GRADIENT_PRESETS = [
  { label: "Warm Sunset Orange", value: "from-[#f97316] via-[#ea580c] to-[#9a3412]", color: "#ea580c" },
  { label: "TRIVA Mountain Crimson", value: "from-[#991b1b] via-[#7f1d1d] to-[#450a0a]", color: "#851919" },
  { label: "Alpine Forest Emerald", value: "from-[#047857] via-[#065f46] to-[#022c22]", color: "#059669" },
  { label: "Tactical Slate Obsidian", value: "from-[#334155] via-[#1e293b] to-[#0f172a]", color: "#334155" },
  { label: "Royal Twilight Indigo", value: "from-[#4338ca] via-[#3730a3] to-[#1e1b4b]", color: "#4338ca" },
  { label: "Deep Amethyst Violet", value: "from-[#7e22ce] via-[#6b21a8] to-[#3b0764]", color: "#7e22ce" },
];

interface ModalEditBannerSlideProps {
  isOpen: boolean;
  onClose: () => void;
  slide: ShowcaseSlide;
  onSave: (updatedSlide: ShowcaseSlide) => void;
  onReset: () => void;
}

export default function ModalEditBannerSlide({
  isOpen,
  onClose,
  slide,
  onSave,
  onReset,
}: ModalEditBannerSlideProps) {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [bgGradient, setBgGradient] = useState("");
  const [titleLine1, setTitleLine1] = useState("");
  const [titleLine2, setTitleLine2] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [socialQuote, setSocialQuote] = useState("");

  useEffect(() => {
    if (slide) {
      setPreviewUrl(slide.imageUrl);
      setUrlInput(slide.imageUrl);
      setBgGradient(slide.bgGradient);
      setTitleLine1(slide.titleLine1);
      setTitleLine2(slide.titleLine2);
      setPrice(slide.price);
      setOriginalPrice(slide.originalPrice);
      setDescription(slide.description);
      setSocialQuote(slide.socialQuote);
    }
  }, [slide]);

  // HANYA ROLE ADMIN YANG DIIZINKAN MEMBUKA & MENGUBAH
  if (!isOpen || currentUser?.role !== "admin") return null;

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

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
  };

  const handleSave = () => {
    if (!previewUrl) {
      alert("Pilih atau masukkan gambar terlebih dahulu.");
      return;
    }

    const updated: ShowcaseSlide = {
      ...slide,
      imageUrl: previewUrl,
      bgGradient,
      titleLine1,
      titleLine2,
      price,
      originalPrice,
      description,
      socialQuote,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Pengaturan Gambar & Konten Slide</span>
              </div>
              <h2 className="text-sm font-black tracking-tight line-clamp-1">
                Ubah Slide: {slide.categoryPill} ({slide.titleLine1} {slide.titleLine2})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Live Preview Box with Card Background */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block">
              Pratinjau Tampilan Slide:
            </label>
            <div
              className={`relative rounded-2xl bg-gradient-to-br ${bgGradient} p-4 text-white flex items-center justify-between shadow-inner overflow-hidden min-h-[140px] border border-white/20`}
            >
              <div className="space-y-1 max-w-[55%] z-10">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/80 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md">
                  {slide.categoryPill}
                </span>
                <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow">
                  {titleLine1} {titleLine2}
                </h3>
                <p className="text-[10px] text-white/80 font-medium line-clamp-1">
                  {socialQuote}
                </p>
                <div className="pt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-white">{price}</span>
                  <span className="text-[10px] text-white/60 line-through font-bold">
                    {originalPrice}
                  </span>
                </div>
              </div>

              {/* Floating Product Image Preview */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center z-10">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-black/20 border border-dashed border-white/30 flex items-center justify-center text-white/60 text-[10px]">
                    Belum ada gambar
                  </div>
                )}
                {/* 3D ground blur */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/40 rounded-full blur-md" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Upload, URL, Presets) */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "upload"
                  ? "bg-white text-triva-crimson shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Gambar</span>
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "url"
                  ? "bg-white text-triva-crimson shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tempel Link URL</span>
            </button>
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "presets"
                  ? "bg-white text-triva-crimson shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preset Estetis</span>
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-triva-crimson rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-rose-50/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-triva-crimson/10 text-triva-crimson flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-slate-800 block">
                    Klik untuk memilih file gambar dari HP / Komputer
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Mendukung format PNG, JPG, JPEG, WebP
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 italic">
                Tips: Gunakan foto produk dengan latar belakang bersih atau transparan (PNG) untuk efek melayang 3D terbaik!
              </p>
            </div>
          )}

          {/* Tab 2: Paste URL */}
          {activeTab === "url" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-triva-crimson text-xs text-slate-800"
                />
                <button
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Terapkan
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Salin tautan gambar dari Unsplash, Google Images, atau server cloud Anda dan tempel di sini.
              </span>
            </div>
          )}

          {/* Tab 3: Curated Presets */}
          {activeTab === "presets" && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                Pilih foto outdoor siap pakai berkualitas tinggi:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-2xl">
                {CURATED_PRESETS.map((item, idx) => {
                  const isSelected = previewUrl === item.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setPreviewUrl(item.url)}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all p-1 flex flex-col items-center text-center group ${
                        isSelected
                          ? "border-triva-crimson ring-2 ring-triva-crimson/30 bg-rose-50/50 scale-102"
                          : "border-slate-200 hover:border-slate-400 bg-white"
                      }`}
                    >
                      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={item.url}
                          alt={item.label}
                          fill
                          className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 mt-1 line-clamp-1 block">
                        {item.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-triva-crimson text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Background Gradient Palette Picker */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-triva-crimson" />
              <span>Pilih Warna Gradien Latar Belakang Slide:</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GRADIENT_PRESETS.map((gp, gIdx) => {
                const isSelected = bgGradient === gp.value;
                return (
                  <button
                    key={gIdx}
                    onClick={() => setBgGradient(gp.value)}
                    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "border-slate-900 ring-2 ring-slate-900/20 scale-105 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className="w-full h-5 rounded-lg shadow-sm"
                      style={{ backgroundColor: gp.color }}
                    />
                    <span className="text-[9px] font-bold text-slate-700 leading-tight text-center line-clamp-1">
                      {gp.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Content Edit (Judul, Harga, Slogan) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-triva-crimson" />
              <span>Sesuaikan Teks & Harga Slide (Opsional):</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Judul Baris 1:
                </label>
                <input
                  type="text"
                  value={titleLine1}
                  onChange={(e) => setTitleLine1(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-triva-crimson"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Judul Baris 2:
                </label>
                <input
                  type="text"
                  value={titleLine2}
                  onChange={(e) => setTitleLine2(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-triva-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Harga Sewa:
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Rp 25.000"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-triva-crimson"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                  Harga Asli (Coret):
                </label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Rp 35.000"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-triva-crimson"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                Slogan / Kutipan di Bawah Gambar:
              </label>
              <input
                type="text"
                value={socialQuote}
                onChange={(e) => setSocialQuote(e.target.value)}
                placeholder="Confidence, wrapped in warmth"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-triva-crimson"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              if (confirm("Kembalikan semua slide ke foto default awal?")) {
                onReset();
                onClose();
              }
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Awal</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-black text-xs shadow-md shadow-triva-crimson/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Gambar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
