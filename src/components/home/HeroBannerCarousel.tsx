"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Phone,
  Mountain,
  Pencil,
  Camera,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ModalEditBannerSlide, {
  ShowcaseSlide,
} from "./ModalEditBannerSlide";

export const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  // SLIDE 1: TRIVA SIGNATURE MOUNTAIN HARDSHELL JACKET (OFFICIAL TRIVA 3D)
  {
    id: 1,
    categoryPill: "TRIVA JACKET",
    name: "TRIVA Signature Mountain Hardshell Jacket",
    tagline: "Signature TRIVA style, engineered for summit trails",
    titleLine1: "Signature Style",
    titleLine2: "Conquer The Ridge",
    description:
      "Jaket hardshell resmi TRIVA Outdoor dengan aksen logo emas ikonik. Material waterproof 3-layer berstandar ekspedisi menjaga tubuh tetap kering dan hangat di tengah hembusan badai berkabut di puncak gunung.",
    price: "Rp 28.000",
    originalPrice: "Rp 40.000",
    selectorLabel: "Choose size:",
    options: ["M", "L", "XL", "XXL"],
    imageUrl: "/showcase/triva-jacket-crimson-3d.png",
    bgGradient: "from-[#851919] via-[#6b1414] to-[#3a0909]",
    accentColor: "#851919",
    socialQuote: "Confidence, wrapped in TRIVA crimson warmth",
  },

  // SLIDE 2: TRIVA CAMPAIGN POSTER (COOL STYLES, NATURE VIBES & DISC 20% OFF)
  {
    id: 2,
    categoryPill: "PROMO 20% OFF",
    name: "Cool Styles, Nature Vibes Trail Promo",
    tagline: "Conquer every trail with our high-performance matching gear",
    titleLine1: "Cool Styles",
    titleLine2: "Nature Vibes",
    description:
      "Paket perlengkapan pendakian matching edisi spesial TRIVA. Nikmati potongan diskon sewa hingga 20% OFF untuk seluruh set outfit dan gear petualangan Anda bersama partner jelajah alam.",
    price: "Disc. 20% OFF",
    originalPrice: "Normal Price",
    selectorLabel: "Pilih Paket:",
    options: ["Couple", "Squad 4P", "Solo Hiker"],
    imageUrl: "/showcase/triva-poster-cool-styles.jpg",
    bgGradient: "from-[#ea580c] via-[#c2410c] to-[#7c2d12]",
    accentColor: "#ea580c",
    socialQuote: "Style on the trail, conquer every summit together",
  },

  // SLIDE 3: TRIVA LEATHER ALPINE MOUNTAIN BOOTS ON MOSSY ROCK
  {
    id: 3,
    categoryPill: "TRIVA BOOTS",
    name: "TRIVA Embossed Leather Alpine Boots",
    tagline: "Unshakeable traction on wet rock & muddy trails",
    titleLine1: "Relentless Grip",
    titleLine2: "On Rugged Trails",
    description:
      "Sepatu trekking kulit premium berembos logo resmi TRIVA. Sol lugged bergerigi anti-slip mencengkeram kuat di bebatuan basah berlumut dan medan tanah terjal licin untuk keselamatan pergelangan kaki Anda.",
    price: "Rp 35.000",
    originalPrice: "Rp 50.000",
    selectorLabel: "Choose size:",
    options: ["40", "41", "42", "43", "44"],
    imageUrl: "/showcase/triva-boots-leather-rock.jpg",
    bgGradient: "from-[#382e2b] via-[#28201d] to-[#140f0d]",
    accentColor: "#443831",
    socialQuote: "Rock-solid grip at every rocky climb",
  },

  // SLIDE 4: ORANGE PUFFER JACKET
  {
    id: 4,
    categoryPill: "PUFFER JACKET",
    name: "Ultra-Warm Goose Down Puffer",
    tagline: "Confidence, wrapped in warmth",
    titleLine1: "Stand out",
    titleLine2: "Without trying",
    description:
      "It's not just about staying warm. It's about stepping outside and instantly feeling confident, comfortable, and completely yourself. Designed to elevate even the simplest outfit, this jacket wraps you in lightweight warmth.",
    price: "Rp 25.000",
    originalPrice: "Rp 35.000",
    selectorLabel: "Choose size:",
    options: ["36", "38", "40", "42"],
    imageUrl:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80",
    bgGradient: "from-[#f97316] via-[#ea580c] to-[#9a3412]",
    accentColor: "#ea580c",
    socialQuote: "Confidence, wrapped in warmth",
  },

  // SLIDE 5: EXPEDITION SUMMIT TENT (TRIVA MOUNTAIN CRIMSON)
  {
    id: 5,
    categoryPill: "TENDA SUMMIT",
    name: "Eiger Shira 4P Double Layer",
    tagline: "Shelter from the storm, luxury in the clouds",
    titleLine1: "Summit ready",
    titleLine2: "In any storm",
    description:
      "Built for extreme ridge conditions with 3000mm water-column shielding and ultra-sturdy 7001 duralumin alloy poles. Experience 5-star mountain comfort and spacious vestibule cooking space at 3000 MDPL.",
    price: "Rp 45.000",
    originalPrice: "Rp 60.000",
    selectorLabel: "Choose capacity:",
    options: ["2P", "4P", "6P"],
    imageUrl:
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    bgGradient: "from-[#991b1b] via-[#7f1d1d] to-[#450a0a]",
    accentColor: "#851919",
    socialQuote: "Five-star comfort above the clouds",
  },

  // SLIDE 6: ERGONOMIC 60L CARRIER (ALPINE EMERALD)
  {
    id: 6,
    categoryPill: "CARRIER 60L",
    name: "Streamline Air Comfort 60L",
    tagline: "Heavy loads feel weightless on your stride",
    titleLine1: "Carry more",
    titleLine2: "Feel lighter",
    description:
      "Featuring an active suspended air-mesh backsystem that prevents heat buildup. Optimal anatomical load transfer directly to the hipbelt, keeping your back fatigue-free on multi-day peak traverses.",
    price: "Rp 40.000",
    originalPrice: "Rp 55.000",
    selectorLabel: "Choose volume:",
    options: ["45L", "60L", "75L"],
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80",
    bgGradient: "from-[#047857] via-[#065f46] to-[#022c22]",
    accentColor: "#059669",
    socialQuote: "Engineered for endless mountain trails",
  },
];

export default function HeroBannerCarousel() {
  const { setShowNewRentalModal, cart, settings, notify, currentUser } = useApp();
  const isAdmin = currentUser?.role === "admin";
  const [slides, setSlides] = useState<ShowcaseSlide[]>(DEFAULT_SHOWCASE_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({
    1: "L",
    2: "Couple",
    3: "42",
    4: "38",
    5: "4P",
    6: "60L",
  });
  const [isPaused, setIsPaused] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ShowcaseSlide | null>(null);

  // Load custom saved slides from localStorage & server on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("triva_custom_banner_slides_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Gagal membaca banner slides dari localStorage:", e);
    }

    fetch("/api/save-custom-items")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.bannerSlides && Array.isArray(data.bannerSlides) && data.bannerSlides.length >= 3) {
          setSlides(data.bannerSlides);
          localStorage.setItem("triva_custom_banner_slides_v2", JSON.stringify(data.bannerSlides));
        }
      })
      .catch((err) => console.log("Server slides fetch fallback:", err));
  }, []);

  // Swipe / Drag handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide every 5.5 seconds (slide ke pinggir)
  useEffect(() => {
    if (isPaused || editingSlide) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, editingSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Save updated slide
  const handleSaveSlide = (updatedSlide: ShowcaseSlide) => {
    const newSlides = slides.map((s) => (s.id === updatedSlide.id ? updatedSlide : s));
    setSlides(newSlides);

    try {
      localStorage.setItem("triva_custom_banner_slides_v2", JSON.stringify(newSlides));
    } catch (e) {
      console.error(e);
    }

    fetch("/api/save-custom-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerSlides: newSlides }),
    })
      .then((res) => res.json())
      .then(() => {
        if (notify) {
          notify(`Foto & data slide "${updatedSlide.name}" berhasil disimpan permanen!`, "success");
        }
      })
      .catch((err) => console.error("Gagal simpan ke server:", err));
  };

  // Reset to original defaults
  const handleResetSlides = () => {
    setSlides(DEFAULT_SHOWCASE_SLIDES);
    try {
      localStorage.removeItem("triva_custom_banner_slides_v2");
    } catch (e) {
      console.error(e);
    }

    fetch("/api/save-custom-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerSlides: DEFAULT_SHOWCASE_SLIDES }),
    })
      .then(() => {
        if (notify) {
          notify("Semua slide telah dikembalikan ke foto bawaan!", "info");
        }
      })
      .catch((err) => console.error(err));
  };

  const nextSlideIndex = (currentSlide + 1) % slides.length;
  const nextSlideData = slides[nextSlideIndex] || slides[0];

  return (
    <>
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl select-none group transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* =========================================================================
            HORIZONTAL SLIDER TRACK (Slide Animasi Ke Pinggir / Horizontal Transition)
           ========================================================================= */}
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, slideIdx) => {
            const selectedOption =
              selectedOptions[slide.id] || slide.options[0];

            return (
              <div
                key={slide.id}
                className={`w-full shrink-0 min-w-full bg-gradient-to-br ${slide.bgGradient} text-white p-3.5 sm:p-6 lg:p-8 xl:p-10 relative flex flex-col justify-between min-h-[520px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[600px] transition-colors`}
              >
                {/* 1. TOP HEADER: LOGO, CAPSULE PILL NAV, ACTIONS */}
                <div className="w-full relative z-20 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-xs text-white">
                        <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <span className="font-black text-xs sm:text-sm tracking-wider uppercase block leading-none">
                          TRIVA OUTDOOR
                        </span>
                        <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest block mt-0.5 sm:hidden">
                          {slide.categoryPill}
                        </span>
                      </div>
                    </div>

                    {/* Desktop / Tablet Capsule Navbar */}
                    <div className="hidden md:flex items-center bg-black/25 backdrop-blur-md rounded-full p-1 border border-white/15 shadow-inner max-w-xl overflow-x-auto no-scrollbar">
                      {slides.map((s, idx) => {
                        const isActive = currentSlide === idx;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setCurrentSlide(idx)}
                            className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                              isActive
                                ? "bg-white text-slate-950 shadow-md scale-105"
                                : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {s.categoryPill}
                          </button>
                        );
                      })}
                    </div>

                    {/* Top Right Actions & Edit Button (Admin Only) */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {/* BUTTON TO CHANGE IMAGE (KHUSUS ADMIN SAJA) */}
                      {isAdmin && (
                        <button
                          onClick={() => setEditingSlide(slide)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 border border-white/30 backdrop-blur-md text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 shadow-md active:scale-95"
                          title="Mode Admin: Ganti foto atau konten slide ini"
                        >
                          <Pencil className="w-3 h-3 text-amber-300" />
                          <span className="hidden sm:inline">Ubah Foto (Admin)</span>
                          <span className="sm:hidden">Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => setShowNewRentalModal(true)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 relative"
                        aria-label="Keranjang Sewa"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {cart.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                            {cart.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Halo TRIVA Outdoor, saya tertarik dengan ${slide.name}.`
                          );
                          window.open(
                            `https://wa.me/${settings.storePhoneWa}?text=${text}`,
                            "_blank"
                          );
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
                        aria-label="Wishlist / Chat"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile-only Scrollable Category Pills */}
                  <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                    {slides.map((s, idx) => {
                      const isActive = currentSlide === idx;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setCurrentSlide(idx)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 transition-all ${
                            isActive
                              ? "bg-white text-slate-950 shadow scale-105"
                              : "bg-black/20 text-white/80 border border-white/10"
                          }`}
                        >
                          {s.categoryPill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* =========================================================================
                    2. MAIN BODY CONTENT
                   ========================================================================= */}
                <div className="my-auto py-2 sm:py-4">
                  {/* DESKTOP LAYOUT (>= 1024px): 3 Balanced Columns */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8 items-center relative z-10">
                    {/* LEFT COLUMN (4 Cols): Arrows, Headline, Desc, CTA */}
                    <div className="lg:col-span-4 space-y-4 text-left">
                      {/* Prev/Next Circular Arrow Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevSlide}
                          className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                          aria-label="Slide sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                          aria-label="Slide berikutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bold Headline */}
                      <div className="space-y-0.5">
                        <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                          {slide.titleLine1}
                        </h1>
                        <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white/95 tracking-tight leading-tight drop-shadow-md">
                          {slide.titleLine2}
                        </h2>
                      </div>

                      {/* Description Paragraph */}
                      <p className="text-xs xl:text-sm text-white/85 leading-relaxed max-w-sm font-medium line-clamp-3">
                        {slide.description}
                      </p>

                      {/* Action Button: Get the look > (Sewa Sekarang) */}
                      <div className="pt-2">
                        <button
                          onClick={() => setShowNewRentalModal(true)}
                          className="px-7 py-3 rounded-full bg-white text-slate-950 hover:bg-white/90 font-black text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <span>Get the look</span>
                          <ChevronRight className="w-4 h-4 text-slate-950" />
                        </button>
                      </div>
                    </div>

                    {/* CENTER COLUMN (4 Cols): Floating 3D Hero Product */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center">
                      <div
                        onClick={() => {
                          if (isAdmin) setEditingSlide(slide);
                        }}
                        className={`relative w-64 h-64 xl:w-76 xl:h-76 flex items-center justify-center group/product ${
                          isAdmin ? "cursor-pointer" : "cursor-default"
                        }`}
                        title={isAdmin ? "Mode Admin: Klik untuk mengubah foto produk ini" : slide.name}
                      >
                        {/* Floating Product Image */}
                        <div className="relative w-full h-full transform group-hover/product:scale-105 group-hover/product:-translate-y-2 transition-transform duration-500 flex items-center justify-center p-2">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.name}
                            fill
                            priority={slideIdx === 0}
                            className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] rounded-2xl"
                          />
                        </div>

                        {/* Hover Overlay: Ganti Foto Badge - STRICTLY ADMIN ONLY */}
                        {isAdmin && (
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/product:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transform scale-90 group-hover/product:scale-100 transition-transform">
                              <Camera className="w-3.5 h-3.5 text-triva-crimson" />
                              <span>Ganti Foto (Admin)</span>
                            </span>
                          </div>
                        )}

                        {/* Realistic 3D Ground Blur Shadow */}
                        <div className="absolute -bottom-2 xl:-bottom-3 left-1/2 -translate-x-1/2 w-48 xl:w-56 h-6 bg-black/45 rounded-full blur-xl pointer-events-none" />
                      </div>

                      {/* Poetic Subtitle Under Product */}
                      <div className="mt-3 text-center">
                        <p className="text-xs xl:text-sm text-white/90 font-medium tracking-wide">
                          {slide.socialQuote}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT COLUMN (4 Cols): Price, Sizes/Options, Next Thumbnail */}
                    <div className="lg:col-span-4 flex flex-col justify-between items-end space-y-6 text-right">
                      {/* Big Price Tag */}
                      <div className="space-y-0.5">
                        <div className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight">
                          {slide.price}
                        </div>
                        <div className="text-sm xl:text-base font-bold text-white/60 line-through">
                          {slide.originalPrice}
                        </div>
                        <span className="text-[10px] text-white/75 font-semibold tracking-wider uppercase block">
                          Tarif per hari
                        </span>
                      </div>

                      {/* Choose Size / Capacity Option Pills */}
                      <div className="space-y-2">
                        <span className="text-xs text-white/90 font-bold block">
                          {slide.selectorLabel}
                        </span>
                        <div className="flex items-center gap-1.5 justify-end flex-wrap">
                          {slide.options.map((opt) => {
                            const isChosen = selectedOption === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() =>
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [slide.id]: opt,
                                  }))
                                }
                                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center justify-center min-w-[36px] ${
                                  isChosen
                                    ? "bg-white text-slate-950 scale-105 shadow-lg ring-2 ring-white/50"
                                    : "bg-black/25 hover:bg-black/45 text-white border border-white/25"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* NEXT SLIDE THUMBNAIL */}
                      <div
                        onClick={nextSlide}
                        className="p-2 sm:p-2.5 rounded-2xl bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 group/thumb flex items-center gap-3 shadow-lg"
                        title={`Geser ke: ${nextSlideData.name}`}
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/20 shrink-0">
                          <Image
                            src={nextSlideData.imageUrl}
                            alt={nextSlideData.name}
                            fill
                            className="object-contain drop-shadow group-hover/thumb:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-left pr-1">
                          <span className="text-[9px] font-black text-white/70 uppercase tracking-widest block">
                            Next Slide &rarr;
                          </span>
                          <span className="text-xs font-extrabold text-white block line-clamp-1 max-w-[120px]">
                            {nextSlideData.categoryPill}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE & TABLET LAYOUT (< 1024px): Clean, Structured, Balanced Rhythm */}
                  <div className="flex flex-col lg:hidden space-y-4">
                    {/* Top: Center 3D Floating Product Image */}
                    <div className="flex flex-col items-center justify-center py-1">
                      <div
                        onClick={() => {
                          if (isAdmin) setEditingSlide(slide);
                        }}
                        className={`relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center group/product ${
                          isAdmin ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <div className="relative w-full h-full transform transition-transform duration-500 flex items-center justify-center p-1">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.name}
                            fill
                            priority={slideIdx === 0}
                            className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] rounded-2xl"
                          />
                        </div>

                        {/* Hover Overlay: Ganti Foto Badge (Admin) */}
                        {isAdmin && (
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/product:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <span className="px-3 py-1 rounded-full bg-white text-slate-950 text-[10px] font-black shadow-lg flex items-center gap-1">
                              <Camera className="w-3 h-3 text-triva-crimson" />
                              <span>Ganti Foto</span>
                            </span>
                          </div>
                        )}

                        {/* Ground Shadow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-4 sm:h-5 bg-black/40 rounded-full blur-lg pointer-events-none" />
                      </div>

                      {/* Caption Under Product */}
                      <p className="text-[11px] sm:text-xs text-white/80 font-medium italic mt-2 text-center">
                        {slide.socialQuote}
                      </p>
                    </div>

                    {/* Middle: Headline & Pricing Card */}
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {slide.titleLine1} {slide.titleLine2}
                          </h2>
                          <p className="text-[11px] sm:text-xs text-white/80 line-clamp-2 mt-1 font-medium leading-relaxed">
                            {slide.description}
                          </p>
                        </div>

                        {/* Price Tag on Mobile */}
                        <div className="text-right shrink-0">
                          <span className="text-xl sm:text-2xl font-black text-white block">
                            {slide.price}
                          </span>
                          <span className="text-[10px] font-bold text-white/60 line-through block">
                            {slide.originalPrice}
                          </span>
                          <span className="text-[9px] text-white/70 uppercase block font-semibold">
                            /hari
                          </span>
                        </div>
                      </div>

                      {/* Bottom Options & CTA on Mobile */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                        {/* Option Pills */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white/70 mr-0.5">
                            {slide.selectorLabel}
                          </span>
                          {slide.options.map((opt) => {
                            const isChosen = selectedOption === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() =>
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [slide.id]: opt,
                                  }))
                                }
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                                  isChosen
                                    ? "bg-white text-slate-950 scale-105 shadow"
                                    : "bg-black/30 text-white border border-white/20"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => setShowNewRentalModal(true)}
                          className="px-5 py-2 rounded-full bg-white text-slate-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <span>Get the look</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    3. BOTTOM FOOTER: SOCIAL ICONS & PROGRESS PILLS
                   ========================================================================= */}
                <div className="flex items-center justify-between w-full pt-3 sm:pt-4 border-t border-white/15 relative z-20">
                  {/* Social Media Links & Next Slide button on Mobile */}
                  <div className="flex items-center gap-2">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      aria-label="Instagram TRIVA"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          "Halo TRIVA Outdoor, saya ingin konsultasi sewa perlengkapan pendakian."
                        );
                        window.open(
                          `https://wa.me/${settings.storePhoneWa}?text=${text}`,
                          "_blank"
                        );
                      }}
                      className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                      aria-label="WhatsApp TRIVA"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-white/60 font-bold ml-1 hidden sm:inline-block">
                      @triva.outdoor
                    </span>
                  </div>

                  {/* Manual Arrow buttons on Mobile + Slide Indicator Dots */}
                  <div className="flex items-center gap-3">
                    {/* Mobile Arrows */}
                    <div className="flex lg:hidden items-center gap-1.5">
                      <button
                        onClick={prevSlide}
                        className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                        aria-label="Slide sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90"
                        aria-label="Slide berikutnya"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                            currentSlide === idx
                              ? "w-6 sm:w-8 bg-white"
                              : "w-1.5 sm:w-2 bg-white/35 hover:bg-white/60"
                          }`}
                          aria-label={`Ke slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPUP MODAL UBAH FOTO & KONTEN SLIDE - HANYA ADMIN */}
      {isAdmin && editingSlide && (
        <ModalEditBannerSlide
          isOpen={!!editingSlide}
          slide={editingSlide}
          onClose={() => setEditingSlide(null)}
          onSave={handleSaveSlide}
          onReset={handleResetSlides}
        />
      )}
    </>
  );
}
