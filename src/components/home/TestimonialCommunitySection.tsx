"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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

interface UgcPhoto {
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

const INITIAL_UGC_PHOTOS: UgcPhoto[] = [
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
];

export default function TestimonialCommunitySection() {
  const [selectedMountain, setSelectedMountain] = useState<string>("all");
  const [ugcPhotos, setUgcPhotos] = useState<UgcPhoto[]>(INITIAL_UGC_PHOTOS);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<UgcPhoto | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<boolean>(false);

  // Filter photos based on mountain selection
  const filteredPhotos =
    selectedMountain === "all"
      ? ugcPhotos
      : ugcPhotos.filter((p) => p.mountainSlug === selectedMountain);

  const handleLikePhoto = (id: string) => {
    setLikedPhotos((prev) => {
      const isCurrentlyLiked = !!prev[id];
      const newStatus = !isCurrentlyLiked;

      setUgcPhotos((currentPhotos) =>
        currentPhotos.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              likes: newStatus ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        })
      );

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

  return (
    <section className="space-y-4 pt-2">
      {/* UGC INSTAGRAM COMMUNITY FEED (#StyleOnTheTrail) */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-triva-crimson/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-rose-300" />
              <span>GALERI KOMUNITAS PENDAKI TRIVA</span>
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

          <div className="flex items-center gap-2 shrink-0">
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

                {/* Mountain Pill Top */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-extrabold text-amber-300 border border-white/10 backdrop-blur-sm">
                    {photo.mountain}
                  </span>
                </div>

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

      {/* MODAL: INSPECT PHOTO DETAIL */}
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

              <div className="pt-2 flex items-center justify-end">
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
    </section>
  );
}
