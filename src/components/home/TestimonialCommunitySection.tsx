"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Camera,
  Tag,
  Copy,
  Check,
  X,
  Compass,
  Pencil,
  Upload,
  Sparkles,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  compressImageFile,
  idbSet,
  idbGet,
  idbDelete,
} from "@/lib/imageCompression";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export interface UgcPhoto {
  id: string;
  climberName: string;
  username: string;
  mountain: string;
  mountainSlug: string;
  altitude: string;
  imageUrl: string;
  caption: string;
  taggedGear: string[];
  likes: number;
}

export const INITIAL_UGC_PHOTOS: UgcPhoto[] = [
  {
    id: "ugc-1",
    climberName: "Rifki Arifin",
    username: "@rifki_arfn",
    mountain: "Gn. Papandayan",
    mountainSlug: "papandayan",
    altitude: "2.665 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    caption: "Misty morning di Hutan Mati Papandayan. Carrier Deuter 60L TRIVA nyaman banget dibawa nanjak berjam-jam!",
    taggedGear: ["Carrier Deuter 60+10L", "Jacket Mountain Windproof", "Trekking Pole Carbon"],
    likes: 342,
  },
  {
    id: "ugc-2",
    climberName: "Nadia Savitri",
    username: "@nadiasavitri_",
    mountain: "Gn. Prau",
    mountainSlug: "prau",
    altitude: "2.565 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    caption: "Malam berbintang & Milky Way di Bukit Teletubbies Prau. Tenda Pavillo TRIVA hangat & bebas embun rembes ⛺✨",
    taggedGear: ["Tenda Pavillo 4P Dome", "Lampu Tenda LED TRIVA", "Sleeping Bag Duck Down"],
    likes: 521,
  },
  {
    id: "ugc-3",
    climberName: "Bagas Wicaksono",
    username: "@bagas_wicak",
    mountain: "Gn. Cikuray",
    mountainSlug: "cikuray",
    altitude: "2.821 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    caption: "Laut lautan awan di Puncak Cikuray! Sepatu Columbia TRIVA nempel mantap di trek tanjakan tanpa selip.",
    taggedGear: ["Sepatu Columbia Redmond", "Gaiter Waterproof", "Trekking Pole Carbon"],
    likes: 418,
  },
  {
    id: "ugc-4",
    climberName: "Siti Rahmawati",
    username: "@sitirahma_mt",
    mountain: "Gn. Gede",
    mountainSlug: "gede",
    altitude: "2.958 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=800&auto=format&fit=crop&q=80",
    caption: "Sunrise magis di Alun-Alun Surya Kencana. Masak air & sarapan pakai nesting set TRIVA yang super higienis.",
    taggedGear: ["Tenda Eiger Shira 4P", "Nesting Cooking Set DS-308", "Kompor Ultralight Kovar"],
    likes: 289,
  },
  {
    id: "ugc-5",
    climberName: "Arif Hidayat",
    username: "@arif_outdoors",
    mountain: "Gn. Merbabu",
    mountainSlug: "merbabu",
    altitude: "3.142 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80",
    caption: "Savana hijau Merbabu yang bikin candu. Frame tenda alloy dari TRIVA tahan terpaan angin badai malam tadi.",
    taggedGear: ["Tenda Naturehike Mongar 2P", "Matras Inflatable R-3.5", "Carrier Deuter 65L"],
    likes: 375,
  },
  {
    id: "ugc-6",
    climberName: "Dimas Anggara",
    username: "@dimas.ang",
    mountain: "Gn. Putri Lembang",
    mountainSlug: "putri",
    altitude: "1.587 MDPL",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80",
    caption: "Family camp ceria. Kursi lipat santai & cangkir kopi outdoor TRIVA bikin akhir pekan bareng anak-anak berkesan.",
    taggedGear: ["Tenda Quechua Arpenaz 4.2", "Kursi Lipat Naturehike", "Flysheet 4x6m"],
    likes: 312,
  },
];

const MOUNTAIN_FILTERS = [
  { label: "Semua Destinasi", slug: "all" },
  { label: "Gn. Papandayan", slug: "papandayan" },
  { label: "Gn. Cikuray", slug: "cikuray" },
  { label: "Gn. Prau", slug: "prau" },
  { label: "Gn. Gede", slug: "gede" },
  { label: "Gn. Merbabu", slug: "merbabu" },
  { label: "Gn. Putri", slug: "putri" },
];

export default function TestimonialCommunitySection() {
  const { currentUser, notify } = useApp();
  const isAdmin = currentUser?.role === "admin";

  const [selectedMountain, setSelectedMountain] = useState<string>("all");
  const [ugcPhotos, setUgcPhotos] = useState<UgcPhoto[]>(INITIAL_UGC_PHOTOS);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<UgcPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<UgcPhoto | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<boolean>(false);

  // Form edit state
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editClimberName, setEditClimberName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editMountain, setEditMountain] = useState("");
  const [editAltitude, setEditAltitude] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load photos on client mount: localStorage -> IndexedDB -> Server Disk API
  useEffect(() => {
    let isMounted = true;

    async function loadGalleryData() {
      let loadedPhotos: UgcPhoto[] | null = null;

      // 1. Coba baca dari localStorage (sangat cepat)
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("triva_ugc_photos");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedPhotos = parsed;
              if (isMounted) setUgcPhotos(parsed);
            }
          }
        } catch (e) {
          console.warn("Storage quota / read warning on localStorage:", e);
        }
      }

      // 2. Jika belum ada di localStorage, cek IndexedDB (anti limit kuota)
      if (!loadedPhotos) {
        try {
          const idbData = await idbGet<UgcPhoto[]>("triva_ugc_photos");
          if (idbData && Array.isArray(idbData) && idbData.length > 0) {
            loadedPhotos = idbData;
            if (isMounted) setUgcPhotos(idbData);
            try {
              localStorage.setItem("triva_ugc_photos", JSON.stringify(idbData));
            } catch (e) {}
          }
        } catch (err) {
          console.warn("IndexedDB read warning:", err);
        }
      }

      // 3. Cek server API (/api/save-custom-items)
      try {
        const res = await fetch("/api/save-custom-items");
        const data = await res.json();
        if (data && data.ugcPhotos && Array.isArray(data.ugcPhotos) && data.ugcPhotos.length > 0) {
          if (!loadedPhotos) {
            if (isMounted) setUgcPhotos(data.ugcPhotos);
            try {
              localStorage.setItem("triva_ugc_photos", JSON.stringify(data.ugcPhotos));
            } catch (e) {}
            await idbSet("triva_ugc_photos", data.ugcPhotos);
          }
        }
      } catch (err) {
        // network/offline fallback
      }
    }

    loadGalleryData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter photos based on mountain selection
  const filteredPhotos =
    selectedMountain === "all"
      ? ugcPhotos
      : ugcPhotos.filter((p) => p.mountainSlug === selectedMountain);

  const handleLikePhoto = (id: string) => {
    setLikedPhotos((prev) => {
      const isCurrentlyLiked = !!prev[id];
      const newStatus = !isCurrentlyLiked;

      setUgcPhotos((currentPhotos) => {
        const updated = currentPhotos.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              likes: newStatus ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        });

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("triva_ugc_photos", JSON.stringify(updated));
          } catch (e) {}
        }
        idbSet("triva_ugc_photos", updated).catch(() => {});

        return updated;
      });

      return { ...prev, [id]: newStatus };
    });
  };

  const handleCopyHashtag = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("#StyleOnTheTrail @trivaoutdoor");
      setCopiedHashtag(true);
      setTimeout(() => setCopiedHashtag(false), 2500);
    }
  };

  // Open Edit Modal (Admin Only)
  const handleOpenEditModal = (photo: UgcPhoto) => {
    if (!isAdmin) return;
    setEditingPhoto(photo);
    setEditImageUrl(photo.imageUrl);
    setEditClimberName(photo.climberName);
    setEditUsername(photo.username);
    setEditMountain(photo.mountain);
    setEditAltitude(photo.altitude);
    setEditCaption(photo.caption);
  };

  // Handle local file upload dengan kompresi otomatis (max 1000px, JPEG hemat kuota)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar valid (.jpg, .png, .webp)");
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 0.82);
      setEditImageUrl(compressedDataUrl);
    } catch (err) {
      console.warn("Kompresi canvas fallback ke FileReader:", err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setEditImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  // Save changes to state, localStorage, IndexedDB, dan Server API
  const handleSaveGalleryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    setIsSaving(true);

    const updated = ugcPhotos.map((p) => {
      if (p.id === editingPhoto.id) {
        return {
          ...p,
          imageUrl: editImageUrl || p.imageUrl,
          climberName: editClimberName || p.climberName,
          username: editUsername || p.username,
          mountain: editMountain || p.mountain,
          altitude: editAltitude || p.altitude,
          caption: editCaption || p.caption,
        };
      }
      return p;
    });

    // 1. Simpan ke React State instan
    setUgcPhotos(updated);

    // 2. Simpan ke localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("triva_ugc_photos", JSON.stringify(updated));
      } catch (e) {
        console.warn("localStorage quota exceeded, disimpan aman di IndexedDB & Server:", e);
      }
    }

    // 3. Simpan ke IndexedDB (kapasitas besar dan persisten)
    await idbSet("triva_ugc_photos", updated);

    // 4. Kirim ke Server API
    try {
      await fetch("/api/save-custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ugcPhotos: updated }),
      });
    } catch (err) {
      console.error("Gagal sinkron ke server file:", err);
    }

    setIsSaving(false);
    notify(`Foto galeri "${editClimberName || editingPhoto.climberName}" berhasil disimpan permanen!`, "success");
    setEditingPhoto(null);
  };

  // Reset to default photos (Admin only)
  const handleResetGallery = async () => {
    if (confirm("Kembalikan seluruh foto galeri komunitas ke bawaan awal?")) {
      setUgcPhotos(INITIAL_UGC_PHOTOS);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("triva_ugc_photos");
        } catch (e) {}
      }
      await idbDelete("triva_ugc_photos");
      try {
        await fetch("/api/save-custom-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ugcPhotos: INITIAL_UGC_PHOTOS }),
        });
      } catch (err) {}
      notify("Galeri komunitas telah direset ke foto bawaan awal.", "info");
    }
  };

  return (
    <section className="space-y-4 pt-2">
      {/* UGC INSTAGRAM COMMUNITY FEED (#StyleOnTheTrail) */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-triva-crimson/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-rose-300" />
              <span>GALERI KOMUNITAS PENDAKI TRIVA</span>
              {isAdmin && (
                <span className="bg-amber-400 text-slate-950 px-2 py-0.2 rounded-md font-black text-[9px] ml-1">
                  Khusus Admin: Bisa Ubah Foto
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>#StyleOnTheTrail</span>
              <span className="text-slate-400 font-normal text-sm sm:text-base hidden sm:inline">&bull;</span>
              <span className="text-slate-300 text-sm sm:text-base font-bold hidden sm:inline">Sorotan dari Puncak</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Potret nyata para pendaki menaklukkan puncak-puncak Indonesia dengan perlengkapan rental
              TRIVA Outdoor yang tangguh dan estetik.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {isAdmin && (
              <button
                type="button"
                onClick={handleResetGallery}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-95"
                title="Reset foto galeri ke default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Default</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all active:scale-95"
            >
              {copiedHashtag ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Hashtag Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin #StyleOnTheTrail</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mountain Destination Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Destinasi:</span>
          </span>
          {MOUNTAIN_FILTERS.map((f) => {
            const isActive = selectedMountain === f.slug;
            return (
              <button
                key={f.slug}
                type="button"
                onClick={() => setSelectedMountain(f.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? "bg-triva-crimson text-white shadow-md shadow-rose-900/30 scale-100"
                    : "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* 6 Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {filteredPhotos.map((photo) => {
            const isLiked = !!likedPhotos[photo.id];

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoModal(photo)}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-800 border border-white/10 hover:border-amber-400/80 transition-all duration-300"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Mountain Pill Top Left */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-extrabold text-amber-300 border border-white/10 backdrop-blur-sm">
                    {photo.mountain}
                  </span>
                </div>

                {/* KHUSUS ADMIN: TOMBOL UBAH FOTO GALERI */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(photo);
                    }}
                    className="absolute top-2 right-2 z-20 px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[9px] shadow-lg flex items-center gap-1 transition-transform hover:scale-105 active:scale-95"
                    title="Ubah foto dan detail galeri ini (Khusus Admin)"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                    <span>Ganti Foto</span>
                  </button>
                )}

                {/* Bottom details */}
                <div className="absolute bottom-2 left-2 right-2 z-10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white truncate">
                      {photo.username}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePhoto(photo.id);
                      }}
                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-300 hover:text-white"
                    >
                      <Heart
                        className={`w-3 h-3 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                      <span>{photo.likes}</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-300 line-clamp-1">
                    {photo.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* UGC INVITATION & 15% DISCOUNT VOUCHER BAR */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-triva-crimson to-rose-900 border border-white/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm sm:text-base text-white">
                  Punya Foto Muncak Keren Pakai Alat TRIVA?
                </h4>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Voucher 15%
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Upload ke Instagram, tag <strong>@trivaoutdoor</strong> &amp; sertakan hashtag{" "}
                <strong>#StyleOnTheTrail</strong>. Dapatkan kode voucher sewa diskon 15% otomatis via DM!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-triva-crimson font-black text-xs hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Tag @trivaoutdoor</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL: INSPECT PHOTO DETAIL (SEMUA USER) */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Image */}
            <div className="relative aspect-[16/10] bg-slate-900">
              <Image
                src={selectedPhotoModal.imageUrl}
                alt={selectedPhotoModal.caption}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedPhotoModal.mountain} &bull; {selectedPhotoModal.altitude}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    {selectedPhotoModal.climberName}
                  </h4>
                  <span className="text-xs text-slate-500 font-bold">
                    {selectedPhotoModal.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLikePhoto(selectedPhotoModal.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    likedPhotos[selectedPhotoModal.id]
                      ? "bg-rose-50 border-rose-200 text-triva-crimson"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedPhotos[selectedPhotoModal.id] ? "fill-triva-crimson text-triva-crimson" : ""
                    }`}
                  />
                  <span>{selectedPhotoModal.likes} Suka</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                &ldquo;{selectedPhotoModal.caption}&rdquo;
              </p>

              {/* Tagged Gear */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Perlengkapan TRIVA pada Foto:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPhotoModal.taggedGear.map((gear, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-rose-50 text-triva-crimson border border-rose-200 px-2.5 py-1 rounded-xl"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{gear}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedPhotoModal;
                      setSelectedPhotoModal(null);
                      handleOpenEditModal(target);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Ubah Foto Ini (Admin)</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={() => setSelectedPhotoModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Tutup Tinjauan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UBAH FOTO GALERI (HANYA UNTUK AKUN ADMIN) */}
      {isAdmin && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
            {/* Header Modal Edit */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider block">
                    Mode Admin &bull; Kustomisasi Galeri
                  </span>
                  <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                    Ubah Foto &amp; Cerita Pendaki
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Edit */}
            <form onSubmit={handleSaveGalleryEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Live Preview Foto */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                  Pratinjau Foto Galeri:
                </label>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                  {editImageUrl ? (
                    <Image
                      src={editImageUrl}
                      alt="Pratinjau"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span>Belum ada gambar</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload File Gambar Baru atau Input URL */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                  1. Upload File Gambar dari Laptop / HP:
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileUpload}
                  disabled={isCompressing || isSaving}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-triva-crimson file:text-white hover:file:bg-triva-crimson-700 file:cursor-pointer cursor-pointer disabled:opacity-50"
                />
                {isCompressing && (
                  <p className="text-[11px] text-amber-600 font-semibold animate-pulse">
                    ⏳ Sedang mengompresi gambar otomatis agar hemat penyimpanan browser...
                  </p>
                )}

                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                    2. Atau Masukkan URL Gambar Langsung:
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson bg-white"
                  />
                </div>
              </div>

              {/* Data Pendaki & Gunung */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Nama Pendaki:
                  </label>
                  <input
                    type="text"
                    value={editClimberName}
                    onChange={(e) => setEditClimberName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Username Instagram:
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Nama Gunung:
                  </label>
                  <input
                    type="text"
                    value={editMountain}
                    onChange={(e) => setEditMountain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Ketinggian (MDPL):
                  </label>
                  <input
                    type="text"
                    value={editAltitude}
                    onChange={(e) => setEditAltitude(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson"
                    placeholder="2.665 MDPL"
                    required
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">
                  Caption Cerita / Testimoni:
                </label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-triva-crimson resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCompressing || isSaving}
                  className="px-5 py-2.5 rounded-xl bg-triva-crimson hover:bg-triva-crimson-700 text-white font-black text-xs shadow-md shadow-triva-crimson/30 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSaving ? "Menyimpan Permanen..." : "Simpan Perubahan Galeri"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
