"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { User, UserRole, GearItem, GearCategory, RentalTransaction, StoreSettings, CartItem, PaymentMethod } from "@/types";
import { createClient } from "@/lib/supabase/client";

function mapRentalToDb(r: RentalTransaction) {
  return {
    id: r.id,
    booking_code: r.bookingCode,
    customer_id: r.customerId,
    customer_name: r.customerName,
    customer_phone: r.customerPhone,
    handled_by_staff_name: r.handledByStaffName || null,
    start_date: r.startDate,
    end_date: r.endDate,
    duration_days: r.durationDays,
    items: r.items,
    total_amount: r.totalAmount,
    down_payment: r.downPayment,
    remaining_amount: r.remainingAmount,
    payment_method: r.paymentMethod,
    status: r.status,
    ktp_photo_url: r.ktpPhotoUrl || null,
    id_card_type: r.idCardType,
    notes: r.notes || null,
    penalty_amount: r.penaltyAmount || 0,
    penalty_notes: r.penaltyNotes || null,
    pelunasan_paid: r.pelunasanPaid || false,
    pelunasan_method: r.pelunasanMethod || null,
    pelunasan_paid_at: r.pelunasanPaidAt || null,
    created_at: r.createdAt,
  };
}

function mapRentalFromDb(row: any): RentalTransaction {
  return {
    id: row.id,
    bookingCode: row.booking_code,
    customerId: row.customer_id || "cust-guest",
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    handledByStaffName: row.handled_by_staff_name || undefined,
    startDate: row.start_date,
    endDate: row.end_date,
    durationDays: Number(row.duration_days) || 1,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount) || 0,
    downPayment: Number(row.down_payment) || 0,
    remainingAmount: Number(row.remaining_amount) || 0,
    paymentMethod: row.payment_method || "qris",
    status: row.status || "pending_dp",
    ktpPhotoUrl: row.ktp_photo_url || undefined,
    idCardType: row.id_card_type || "KTP Asli",
    notes: row.notes || undefined,
    penaltyAmount: Number(row.penalty_amount) || 0,
    penaltyNotes: row.penalty_notes || undefined,
    pelunasanPaid: Boolean(row.pelunasan_paid),
    pelunasanMethod: row.pelunasan_method || undefined,
    pelunasanPaidAt: row.pelunasan_paid_at || undefined,
    createdAt: row.created_at,
  };
}

function mapCategoryFromDb(c: any): GearCategory {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    sublabel: c.sublabel || undefined,
    icon: c.icon || "Tent",
    description: c.description || "",
    imageUrl: c.image_url || undefined,
  };
}

function mapItemFromDb(i: any): GearItem {
  return {
    id: i.id,
    unitCode: i.unit_code,
    categoryId: i.category_id,
    categoryName: i.category_name || "Outdoor",
    name: i.name,
    pricePerDay: Number(i.price_per_day) || 0,
    status: i.status || "available",
    imageUrl: i.image_url || undefined,
    conditionNotes: i.condition_notes || undefined,
  };
}

export interface EditImageTarget {
  type: "item" | "category";
  id: string;
  name: string;
  currentImageUrl: string;
  categorySlug?: string;
}

interface Notification {
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  logout: () => Promise<void>;
  demoUsers: User[];
  switchUser: (role: UserRole) => void;
  categories: GearCategory[];
  items: GearItem[];
  rentals: RentalTransaction[];
  settings: StoreSettings;
  notification: Notification | null;
  notify: (msg: string, type?: "success" | "error" | "info") => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  showNewRentalModal: boolean;
  setShowNewRentalModal: (val: boolean) => void;
  preselectedItem: GearItem | null;
  openNewRentalModalWithItem: (item?: GearItem) => void;
  showQrisModal: boolean;
  setShowQrisModal: (val: boolean) => void;
  editingTarget: EditImageTarget | null;
  setEditingTarget: (target: EditImageTarget | null) => void;
  updateItemImage: (itemId: string, newImageUrl: string) => void;
  updateCategoryImage: (categoryId: string, newImageUrl: string) => void;
  persistCurrentPhotosToServer: (customItems?: GearItem[], customCats?: GearCategory[]) => Promise<boolean>;
  addRental: (
    rentalData: Omit<RentalTransaction, "id" | "bookingCode" | "createdAt"> & {
      bookingCode?: string;
    }
  ) => RentalTransaction;
  updateRentalStatus: (
    id: string,
    newStatus: RentalTransaction["status"],
    penalty?: number,
    penaltyNotes?: string,
    pelunasanData?: { method: PaymentMethod }
  ) => void;
  deleteRental: (id: string) => void;
  resetAllRentals: () => Promise<void>;
  cart: CartItem[];
  addToCart: (item: GearItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (val: boolean) => void;
  preselectedDates: { startDate: string; endDate: string } | null;
  setPreselectedDates: (dates: { startDate: string; endDate: string } | null) => void;
  setPreselectedItem: (item: GearItem | null) => void;
  clearPreselected: () => void;
  checkoutFromCart: (dates?: { startDate: string; endDate: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DEMO_USERS: User[] = [
  {
    id: "usr-admin-1",
    name: "Rifki",
    email: "owner@triva.id",
    phoneWa: "083851284143",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-staff-1",
    name: "Arifin",
    email: "staff@triva.id",
    phoneWa: "081298765432",
    role: "staff",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-cust-1",
    name: "Dimas Anggara (Pendaki)",
    email: "dimas.hiker@gmail.com",
    phoneWa: "085712349988",
    role: "customer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_CATEGORIES: GearCategory[] = [
  {
    id: "cat-1",
    name: "TENDA",
    slug: "tenda",
    sublabel: "Dome 2P-6P",
    icon: "Tent",
    description: "Tenda dome kapasitas 2-6 orang tahan angin badai & hujan lebat puncak",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-2",
    name: "BAGS",
    slug: "carrier",
    sublabel: "Carrier 45L-75L",
    icon: "Backpack",
    description: "Tas gunung kapasitas 45L sampai 75L dengan backsystem empuk ergonomis",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-3",
    name: "SEPATU",
    slug: "sepatu",
    sublabel: "Trekking & Trail",
    icon: "Footprints",
    description: "Sepatu hiking waterproof & tracking boots cengkeraman kuat di medan terjal",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-4",
    name: "ACCESSORIES",
    slug: "aksesoris",
    sublabel: "Headlamp & Pole",
    icon: "Compass",
    description: "Headlamp, trekking pole, sleeping bag bulu angsa, matras foil & lentera camp",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-5",
    name: "CELANA",
    slug: "celana",
    sublabel: "Cargo & Quickdry",
    icon: "Shirt",
    description: "Celana cargo quickdry, celana sambung 2-in-1, dan thermal baselayer pendaki",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-6",
    name: "ALAT MASAK",
    slug: "alat-masak",
    sublabel: "Kompor & Nesting",
    icon: "Flame",
    description: "Kompor portable windproof, nesting camping teflon, dan set peralatan masak",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-7",
    name: "JACKET",
    slug: "jaket",
    sublabel: "Waterproof Puncak",
    hasFlashSale: true,
    icon: "Shirt",
    description: "Jaket waterproof windproof, down jacket thermal hangat tahan dingin sub-zero",
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_ITEMS: GearItem[] = [
  // ==========================================
  // 1. TENDA GUNUNG (7 Unit)
  // ==========================================
  {
    id: "item-1",
    unitCode: "TND-01",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Eiger Shira 4P Double Layer",
    pricePerDay: 45000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Frame alloy kokoh tahan badai, pasak 10 pcs lengkap, outer 3000mm",
  },
  {
    id: "item-2",
    unitCode: "TND-02",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Consina Magnum 4 Kapasitas 4P",
    pricePerDay: 40000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Vestibule teras luas untuk masak, seal jahitan aman tanpa rembes",
  },
  {
    id: "item-3",
    unitCode: "TND-03",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Arei Eliot 2P Ultralight",
    pricePerDay: 30000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bobot ringan 1.8kg, sangat cocok untuk pendakian tektok/solo",
  },
  {
    id: "item-4",
    unitCode: "TND-04",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Naturehike Cloud Up 2 Pro",
    pricePerDay: 35000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kain 20D silnylon ultralight, tahan badai angin kencang punggungan",
  },
  {
    id: "item-5",
    unitCode: "TND-05",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Mountain Hardwear Trango 3P Expedition",
    pricePerDay: 60000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Standar ekspedisi 4 musim, 5 tiang duralumin stabil di salju & badai",
  },
  {
    id: "item-6",
    unitCode: "TND-06",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Big Agnes Copper Spur HV 3P",
    pricePerDay: 55000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Ultralight 3 orang dengan kanopi teras luas dan sirkulasi udara optimal",
  },
  {
    id: "item-7",
    unitCode: "TND-07",
    categoryId: "cat-1",
    categoryName: "TENDA",
    name: "Tenda Dome Pavillo Family 6P Jumbo",
    pricePerDay: 65000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kapasitas 6 orang dewasa, tinggi 1.8m bisa berdiri santai di dalam",
  },

  // ==========================================
  // 2. BAGS / CARRIER (7 Unit)
  // ==========================================
  {
    id: "item-8",
    unitCode: "CR-01",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Osprey Atmos AG 65L",
    pricePerDay: 45000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Anti-Gravity mesh backsystem anti pegal, raincover original",
  },
  {
    id: "item-9",
    unitCode: "CR-02",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Deuter Aircontact 60+10L",
    pricePerDay: 40000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kapasitas muat maksimal, buckle utuh kuat membawa beban 25kg",
  },
  {
    id: "item-10",
    unitCode: "CR-03",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Eiger Rhinos 60L Series",
    pricePerDay: 35000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan cordura tahan gesek, kompartemen bawah sleeping bag",
  },
  {
    id: "item-11",
    unitCode: "CR-04",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Consina Tarebbi 60L Ergonomic",
    pricePerDay: 30000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Backsystem nyaman busa tebal, double frame aluminium stabil",
  },
  {
    id: "item-12",
    unitCode: "CR-05",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Gregory Baltoro 75L Pro",
    pricePerDay: 50000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kapasitas jumbo 75L, suspensi Response A3 otomatis menyesuaikan pinggul",
  },
  {
    id: "item-13",
    unitCode: "CR-06",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Carrier Arei Toba 55L Air Comfort",
    pricePerDay: 30000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Ringan & ramping, jaring sirkulasi punggung tidak gerah saat terik",
  },
  {
    id: "item-14",
    unitCode: "CR-07",
    categoryId: "cat-2",
    categoryName: "BAGS",
    name: "Daypack Deuter Futura 32L Summit",
    pricePerDay: 25000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Ukuran pas untuk tektok sehari atau summit attack dari basecamp",
  },

  // ==========================================
  // 3. SEPATU GUNUNG (7 Unit)
  // ==========================================
  {
    id: "item-15",
    unitCode: "SPT-01",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Eiger Anaconda Mid Waterproof",
    pricePerDay: 35000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Outsole Vibram cengkeraman kuat, pelindung mata kaki aman terkilir",
  },
  {
    id: "item-16",
    unitCode: "SPT-02",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Salomon X Ultra 4 GTX Trail",
    pricePerDay: 40000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Gore-Tex waterproof membran, sangat stabil untuk turunan berbatu",
  },
  {
    id: "item-17",
    unitCode: "SPT-03",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Columbia Crestwood Waterproof",
    pricePerDay: 35000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan suede kulit sintetis tahan air, bantalan Techlite empuk",
  },
  {
    id: "item-18",
    unitCode: "SPT-04",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Merrell Moab 3 Mid Gore-Tex",
    pricePerDay: 40000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Sepatu gunung favorit pendaki dunia, grip mantap di lumpur basah",
  },
  {
    id: "item-19",
    unitCode: "SPT-05",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Arei Mount Kinabalu High Ankle",
    pricePerDay: 30000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "High cut melindungi engkel saat mengangkut ransel berat",
  },
  {
    id: "item-20",
    unitCode: "SPT-06",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu The North Face Hedgehog Fastpack",
    pricePerDay: 40000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Ringan & responsif, membran breathable menjaga kaki tetap kering",
  },
  {
    id: "item-21",
    unitCode: "SPT-07",
    categoryId: "cat-3",
    categoryName: "SEPATU",
    name: "Sepatu Karrimor Mount Mid Waterproof",
    pricePerDay: 30000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "WeatherTite teknologi tahan hujan lebat, sol tebal anti slip",
  },

  // ==========================================
  // 4. ACCESSORIES OUTDOOR (7 Unit)
  // ==========================================
  {
    id: "item-22",
    unitCode: "ACC-01",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Headlamp USB Rechargeable 500 Lumens",
    pricePerDay: 10000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Baterai tahan 12 jam, termasuk mode lampu merah (night vision)",
  },
  {
    id: "item-23",
    unitCode: "ACC-02",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Trekking Pole Duralumin Anti-Shock (Sepasang)",
    pricePerDay: 10000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kuncian twist lock kokoh, pegangan gabus empuk anti licin",
  },
  {
    id: "item-24",
    unitCode: "ACC-03",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Sleeping Bag Bulu Angsa TRIVA Limit 0°C",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bulu angsa padat wangi & bersih, hangat di ketinggian 3000 mdpl",
  },
  {
    id: "item-25",
    unitCode: "ACC-04",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Matras Foil Alumunium Reflektif Tebal",
    pricePerDay: 5000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Dua sisi alumunium menahan hawa dingin lantai tenda",
  },
  {
    id: "item-26",
    unitCode: "ACC-05",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Hammock Ultralight Arei + Tali Webbing",
    pricePerDay: 10000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan parasut kuat tahan beban 150kg, jahitan bartex 3 lapis",
  },
  {
    id: "item-27",
    unitCode: "ACC-06",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Lampu Tenda Camping Magnetic Rechargeable",
    pricePerDay: 8000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bisa ditempel magnet di frame tenda atau digantung, 3 mode cahaya",
  },
  {
    id: "item-28",
    unitCode: "ACC-07",
    categoryId: "cat-4",
    categoryName: "ACCESSORIES",
    name: "Water Bladder Hydration Bag 2L TPU",
    pricePerDay: 10000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan food grade BPA free anti bocor, selang minum higienis",
  },

  // ==========================================
  // 5. CELANA GUNUNG (7 Unit) [MENGGANTIKAN SENDAL]
  // ==========================================
  {
    id: "item-29",
    unitCode: "CLN-01",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Cargo Quickdry Trekking Eiger",
    pricePerDay: 18000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan stretch cepat kering, 6 saku resleting aman untuk gadget",
  },
  {
    id: "item-30",
    unitCode: "CLN-02",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Sambung 2-in-1 Arei Trekking",
    pricePerDay: 20000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Resleting lutut bisa dilepas jadi celana pendek saat cuaca terik",
  },
  {
    id: "item-31",
    unitCode: "CLN-03",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Waterproof Hardshell Summit Badai",
    pricePerDay: 22000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Outer tahan air 10.000mm, melindungi celana dalam dari basah kuyup",
  },
  {
    id: "item-32",
    unitCode: "CLN-04",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Polar Thermal Inner Gunung Hangat",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bulu polar lembut menahan dingin malam hari di dalam sleeping bag",
  },
  {
    id: "item-33",
    unitCode: "CLN-05",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Tactical Cargo Consina Ripstop",
    pricePerDay: 18000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kain tenun kotak ripstop tidak mudah robek terkena duri atau batu",
  },
  {
    id: "item-34",
    unitCode: "CLN-06",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Baselayer Compression Tight TRIVA",
    pricePerDay: 12000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Elastis menopang otot paha & betis mencegah kram saat tanjakan terjal",
  },
  {
    id: "item-35",
    unitCode: "CLN-07",
    categoryId: "cat-5",
    categoryName: "CELANA",
    name: "Celana Pendek Trail Running & Tektok",
    pricePerDay: 12000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Sangat ringan 120 gram dengan celana dalam jaring terintegrasi",
  },

  // ==========================================
  // 6. ALAT MASAK & DAPUR (7 Unit)
  // ==========================================
  {
    id: "item-36",
    unitCode: "MSK-01",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Kompor Mawar Windproof Kovar Portable",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Baling pelindung angin berfungsi, pemantik otomatis menyala prima",
  },
  {
    id: "item-37",
    unitCode: "MSK-02",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Cooking Set Nesting DS-308 Lengkap",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Panci anti lengket, wajan teflon, sendok sup, spons pembersih",
  },
  {
    id: "item-38",
    unitCode: "MSK-03",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Teko Camping Ultralight Kettle 0.8L",
    pricePerDay: 10000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Aluminium anodized cepat mendidihkan air kopi/teh di camp puncak",
  },
  {
    id: "item-39",
    unitCode: "MSK-04",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Kompor Mini Ultralight BRS-3000T Titanium",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Kompor terkecil di dunia hanya 25 gram, daya api 2700W sangat kencang",
  },
  {
    id: "item-40",
    unitCode: "MSK-05",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Panggangan Portable Grill Camping Lipat",
    pricePerDay: 20000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bahan stainless steel anti karat, bisa dilipat ringkas masuk tas",
  },
  {
    id: "item-41",
    unitCode: "MSK-06",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Cangkir & Sendok Garpu Lipat Stainless Set",
    pricePerDay: 8000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Set alat makan lengkap 1 orang higienis dengan kantong jaring",
  },
  {
    id: "item-42",
    unitCode: "MSK-07",
    categoryId: "cat-6",
    categoryName: "ALAT MASAK",
    name: "Windshield Pelindung Angin Kompor 10 Plat",
    pricePerDay: 5000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Plat alumunium lipat menahan tiupan angin gunung agar gas hemat",
  },

  // ==========================================
  // 7. JACKET & APPAREL (7 Unit)
  // ==========================================
  {
    id: "item-43",
    unitCode: "JKT-01",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Jaket Gunung Waterproof Eiger Tropical",
    pricePerDay: 25000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Breathable seam sealed, hoodie kencang tahan terpaan angin badai",
  },
  {
    id: "item-44",
    unitCode: "JKT-02",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Down Jacket Bulu Angsa TRIVA Thermal",
    pricePerDay: 25000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Sangat hangat untuk camp malam di ketinggian di atas 2.500 mdpl",
  },
  {
    id: "item-45",
    unitCode: "JKT-03",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Windbreaker Ultralight Packable Arei",
    pricePerDay: 18000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bisa dilipat sebesar kepalan tangan, menahan angin dingin punggungan",
  },
  {
    id: "item-46",
    unitCode: "JKT-04",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Jaket 3-in-1 Inner Polar Consina Explorer",
    pricePerDay: 28000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Dua lapis (outer waterproof + inner polar) bisa dipakai terpisah",
  },
  {
    id: "item-47",
    unitCode: "JKT-05",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Hardshell Gore-Tex Pro Summit Mountaineering",
    pricePerDay: 35000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Ketahanan air level tertinggi, ritsleting YKK aquaguard tahan badai",
  },
  {
    id: "item-48",
    unitCode: "JKT-06",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Rompi Gunung Vest Windproof Arei",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Menjaga dada tetap hangat saat mendaki tanpa membuat lengan gerah",
  },
  {
    id: "item-49",
    unitCode: "JKT-07",
    categoryId: "cat-7",
    categoryName: "JACKET",
    name: "Raincoat Poncho Tarp Ultralight Silnylon",
    pricePerDay: 15000,
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Jas hujan multifungsi bisa dibentangkan jadi flysheet bivak darurat",
  },
];

const INITIAL_RENTALS: RentalTransaction[] = [];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: "TRIVA Outdoor Rental",
  storeTagline: "Style on the Trail",
  storePhoneWa: "6283851284143",
  storeAddress: "Jl. Kaliurang KM 12.5 No. 88, Sleman, D.I. Yogyakarta",
  minDpPercentage: 30,
  lateFeePerDay: 25000,
  returnDeadlineHour: "21:00",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("triva_current_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.role) {
            if (parsed.role === "admin" && (parsed.phoneWa === "081234567890" || !parsed.phoneWa)) {
              parsed.phoneWa = "083851284143";
            }
            return parsed;
          }
        }
      } catch (e) {
        console.error("Gagal membaca user dari localStorage:", e);
      }
    }
    return INITIAL_DEMO_USERS[0];
  });
  const [categories, setCategories] = useState<GearCategory[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<GearItem[]>(INITIAL_ITEMS);
  const [rentals, setRentals] = useState<RentalTransaction[]>(INITIAL_RENTALS);
  const [settings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNewRentalModal, setShowNewRentalModal] = useState(false);
  const [preselectedItem, setPreselectedItem] = useState<GearItem | null>(null);
  const [preselectedDates, setPreselectedDates] = useState<{ startDate: string; endDate: string } | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditImageTarget | null>(null);
  const [isRentalsLoaded, setIsRentalsLoaded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const recentlyCreatedBookingCodes = useRef<Set<string>>(new Set());

  const clearPreselected = () => {
    setPreselectedItem(null);
    setPreselectedDates(null);
  };

  // Load custom state (transaksi sewa, items, categories) dari localStorage & server file
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRentals = localStorage.getItem("triva_rentals");
        if (savedRentals) {
          const parsedRentals = JSON.parse(savedRentals);
          if (Array.isArray(parsedRentals)) {
            setRentals(parsedRentals);
          }
        }

        const savedItems = localStorage.getItem("triva_custom_items");
        let hasLocalCustomItems = false;
        let localParsedItems: GearItem[] | null = null;
        if (savedItems) {
          const parsed = JSON.parse(savedItems);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
            hasLocalCustomItems = true;
            localParsedItems = parsed;
          }
        }

        const savedCats = localStorage.getItem("triva_custom_categories");
        let hasLocalCustomCats = false;
        let localParsedCats: GearCategory[] | null = null;
        if (savedCats) {
          const parsedCats = JSON.parse(savedCats);
          if (Array.isArray(parsedCats) && parsedCats.length > 0) {
            setCategories(parsedCats);
            hasLocalCustomCats = true;
            localParsedCats = parsedCats;
          }
        }

        const savedCart = localStorage.getItem("triva_cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }

        // AUTO-SYNC DENGAN SERVER DISK (src/data/):
        // 1. Jika browser sudah ada custom foto di localStorage -> kirim ke server agar aman di disk
        // 2. Jika browser kosong/baru -> ambil dari file server disk agar foto yang pernah diganti langsung muncul
        fetch("/api/save-custom-items")
          .then((r) => r.json())
          .then((serverData) => {
            if (serverData.success) {
              if (!hasLocalCustomItems && serverData.items && Array.isArray(serverData.items)) {
                setItems(serverData.items);
                localStorage.setItem("triva_custom_items", JSON.stringify(serverData.items));
              }
              if (!hasLocalCustomCats && serverData.categories && Array.isArray(serverData.categories)) {
                setCategories(serverData.categories);
                localStorage.setItem("triva_custom_categories", JSON.stringify(serverData.categories));
              }

              // Jika localStorage punya data foto manual, simpan balik ke server file
              if (hasLocalCustomItems || hasLocalCustomCats) {
                fetch("/api/save-custom-items", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    items: localParsedItems,
                    categories: localParsedCats,
                  }),
                }).catch(() => {});
              }
            }
          })
          .catch((err) => {
            console.error("Auto-sync server custom data error:", err);
          });
      } catch (e) {
        console.error("Failed to load local saved state:", e);
      } finally {
        setIsRentalsLoaded(true);
      }
    }
  }, []);

  // REAL-TIME SUPABASE SYNC UNTUK TRANSAKSI SEWA, KATALOG, DAN INVENTARIS
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSupabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (!isSupabaseConfigured) return;

    try {
      const supabase = createClient();

      // 1. Ambil data awal Transaksi Sewa dari Supabase
      (supabase as any)
        .from("rentals")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }: any) => {
          if (!error && data && Array.isArray(data) && data.length > 0) {
            const parsed = data.map(mapRentalFromDb);
            setRentals(parsed);
            localStorage.setItem("triva_rentals", JSON.stringify(parsed));
          }
        });

      // 2. Ambil data Kategori dari Supabase Cloud
      (supabase as any)
        .from("categories")
        .select("*")
        .then(({ data: catData, error: catError }: any) => {
          if (!catError && catData && Array.isArray(catData) && catData.length > 0) {
            const parsedCats = catData.map(mapCategoryFromDb);
            setCategories(parsedCats);
            localStorage.setItem("triva_custom_categories", JSON.stringify(parsedCats));
          }
        });

      // 3. Ambil data Master Unit Alat dari Supabase Cloud
      (supabase as any)
        .from("items")
        .select("*")
        .then(({ data: itemData, error: itemError }: any) => {
          if (!itemError && itemData && Array.isArray(itemData) && itemData.length > 0) {
            const parsedItems = itemData.map(mapItemFromDb);
            setItems(parsedItems);
            localStorage.setItem("triva_custom_items", JSON.stringify(parsedItems));
          }
        });

      // 4. Langganan perubahan real-time (Postgres Changes) multi-tabel
      const channel = supabase
        .channel("realtime-triva-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rentals" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newR = mapRentalFromDb(payload.new);
              setRentals((prev) => [
                newR,
                ...prev.filter(
                  (r) => r.id !== newR.id && r.bookingCode !== newR.bookingCode
                ),
              ]);
              if (!recentlyCreatedBookingCodes.current.has(newR.bookingCode)) {
                notify(`🔔 [Realtime] Pesanan baru ${newR.bookingCode} (${newR.customerName}) masuk!`, "info");
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedR = mapRentalFromDb(payload.new);
              setRentals((prev) => prev.map((r) => (r.id === updatedR.id ? updatedR : r)));
            } else if (payload.eventType === "DELETE") {
              const oldId = (payload.old as any)?.id;
              if (oldId) {
                setRentals((prev) => prev.filter((r) => r.id !== oldId));
              }
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "items" },
          (payload) => {
            if (payload.eventType === "UPDATE") {
              const updatedItem = mapItemFromDb(payload.new);
              setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
            } else if (payload.eventType === "INSERT") {
              const newItem = mapItemFromDb(payload.new);
              setItems((prev) => [newItem, ...prev.filter((it) => it.id !== newItem.id)]);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "categories" },
          (payload) => {
            if (payload.eventType === "UPDATE") {
              const updatedCat = mapCategoryFromDb(payload.new);
              setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.error("Supabase Realtime subscription error:", e);
    }
  }, []);

  // 1. Sinkronisasi currentUser ke localStorage agar akun yang sedang aktif tidak hilang saat refresh
  useEffect(() => {
    if (typeof window !== "undefined" && currentUser) {
      try {
        localStorage.setItem("triva_current_user", JSON.stringify(currentUser));
      } catch (e) {
        console.error("Failed to save currentUser to localStorage:", e);
      }
    }
  }, [currentUser]);

  // 2. Pulihkan Sesi Supabase Auth Asli saat halaman di-refresh (misal login sebagai Asep)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSupabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (!isSupabaseConfigured) return;

    try {
      const supabase = createClient();

      // Cek sesi aktif di Supabase Auth saat refresh
      supabase.auth.getSession().then(async ({ data: { session }, error }: any) => {
        if (!error && session?.user) {
          try {
            const { data: profile } = await (supabase as any)
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();

            const role: UserRole =
              (profile?.role as UserRole) ||
              (session.user.user_metadata?.role as UserRole) ||
              "customer";

            const restoredUser: User = {
              id: session.user.id,
              name:
                profile?.full_name ||
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0] ||
                "User",
              email: session.user.email || "",
              phoneWa:
                profile?.phone_wa ||
                session.user.user_metadata?.phone_wa ||
                "",
              role: role,
            };

            setCurrentUser(restoredUser);
            localStorage.setItem("triva_current_user", JSON.stringify(restoredUser));
          } catch (err) {
            console.error("Error restoring user profile from Supabase:", err);
          }
        }
      });

      // Langganan event login/logout Supabase
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
        if (
          (event === "SIGNED_IN" ||
            event === "TOKEN_REFRESHED" ||
            event === "USER_UPDATED") &&
          session?.user
        ) {
          try {
            const { data: profile } = await (supabase as any)
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();

            const role: UserRole =
              (profile?.role as UserRole) ||
              (session.user.user_metadata?.role as UserRole) ||
              "customer";

            const loggedInUser: User = {
              id: session.user.id,
              name:
                profile?.full_name ||
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0] ||
                "User",
              email: session.user.email || "",
              phoneWa:
                profile?.phone_wa ||
                session.user.user_metadata?.phone_wa ||
                "",
              role: role,
            };

            setCurrentUser(loggedInUser);
            localStorage.setItem("triva_current_user", JSON.stringify(loggedInUser));
          } catch (err) {
            console.error("Error in onAuthStateChange profile fetch:", err);
          }
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem("triva_current_user");
          setCurrentUser({
            id: "usr-guest",
            name: "Tamu",
            email: "",
            phoneWa: "",
            role: "customer",
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.error("Supabase Auth session check error:", e);
    }
  }, []);

  // Simpan setiap perubahan transaksi sewa (tambah, setujui, ubah status) ke localStorage agar tidak hilang saat di-refresh
  useEffect(() => {
    if (isRentalsLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("triva_rentals", JSON.stringify(rentals));
      } catch (e) {
        console.error("Failed to save rentals to localStorage:", e);
      }
    }
  }, [rentals, isRentalsLoaded]);

  // Sinkronisasi status ketersediaan unit alat berdasarkan transaksi aktif
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => {
        const isRented = rentals.some(
          (r) => r.status === "active" && r.items.some((ri) => ri.itemId === it.id)
        );
        if (isRented && it.status !== "rented") {
          return { ...it, status: "rented" };
        }
        if (!isRented && it.status === "rented") {
          return { ...it, status: "available" };
        }
        return it;
      })
    );
  }, [rentals]);

  const persistCurrentPhotosToServer = async (
    customItems?: GearItem[],
    customCats?: GearCategory[]
  ): Promise<boolean> => {
    try {
      const itemsToSave = customItems || items;
      const catsToSave = customCats || categories;
      const res = await fetch("/api/save-custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToSave, categories: catsToSave }),
      });
      const data = await res.json();
      if (data.success) {
        notify("💾 Seluruh foto & kustomisasi berhasil disimpan permanen ke server file!", "success");
        return true;
      } else {
        notify("Gagal menyimpan foto ke server: " + (data.error || "Unknown"), "error");
        return false;
      }
    } catch (e: any) {
      console.error("Gagal menyimpan ke server:", e);
      notify("Gagal terhubung ke server saat menyimpan foto", "error");
      return false;
    }
  };

  const updateItemImage = (itemId: string, newImageUrl: string) => {
    setItems((prev) => {
      const updated = prev.map((it) => (it.id === itemId ? { ...it, imageUrl: newImageUrl } : it));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("triva_custom_items", JSON.stringify(updated));
        } catch (e) {}
      }

      // Sync langsung ke Supabase Cloud
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        try {
          const supabase = createClient();
          (supabase as any)
            .from("items")
            .update({ image_url: newImageUrl })
            .eq("id", itemId)
            .then(({ error }: any) => {
              if (error) console.error("Gagal update foto item di Supabase:", error);
            });
        } catch (err) {}
      }

      // Simpan juga ke server file lokal sebagai cadangan permanen
      fetch("/api/save-custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated, categories }),
      }).catch((e) => console.error("Auto save item image to server failed:", e));
      return updated;
    });
  };

  const updateCategoryImage = (categoryId: string, newImageUrl: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) =>
        cat.id === categoryId || cat.slug === categoryId
          ? { ...cat, imageUrl: newImageUrl }
          : cat
      );
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("triva_custom_categories", JSON.stringify(updated));
        } catch (e) {}
      }

      // Sync langsung ke Supabase Cloud
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        try {
          const supabase = createClient();
          (supabase as any)
            .from("categories")
            .update({ image_url: newImageUrl })
            .or(`id.eq.${categoryId},slug.eq.${categoryId}`)
            .then(({ error }: any) => {
              if (error) console.error("Gagal update foto kategori di Supabase:", error);
            });
        } catch (err) {}
      }

      // Simpan juga ke server file lokal sebagai cadangan permanen
      fetch("/api/save-custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, categories: updated }),
      }).catch((e) => console.error("Auto save category image to server failed:", e));
      return updated;
    });
  };

  const openNewRentalModalWithItem = (item?: GearItem) => {
    setPreselectedItem(item || null);
    setShowNewRentalModal(true);
  };

  const notify = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const logout = async () => {
    try {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Logout error:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("triva_current_user");
    }
    const guestUser: User = {
      id: "usr-guest",
      name: "Tamu",
      email: "",
      phoneWa: "",
      role: "customer",
    };
    setCurrentUser(guestUser);
    notify("Anda telah berhasil keluar dari akun (Logout).", "info");
  };

  const switchUser = (role: UserRole) => {
    const target = INITIAL_DEMO_USERS.find((u) => u.role === role) || INITIAL_DEMO_USERS[0];
    setCurrentUser(target);
    if (typeof window !== "undefined") {
      localStorage.setItem("triva_current_user", JSON.stringify(target));
    }
    notify(`Beralih ke akun ${target.name} (${target.role.toUpperCase()})`, "info");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const addRental = (
    data: Omit<RentalTransaction, "id" | "bookingCode" | "createdAt"> & {
      bookingCode?: string;
    }
  ): RentalTransaction => {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newRental: RentalTransaction = {
      ...data,
      id: `rent-${Date.now()}`,
      bookingCode:
        data.bookingCode ||
        `TRV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${randomSeq}`,
      createdAt: new Date().toISOString(),
    };

    setRentals((prev) => [
      newRental,
      ...prev.filter((r) => r.id !== newRental.id && r.bookingCode !== newRental.bookingCode),
    ]);

    recentlyCreatedBookingCodes.current.add(newRental.bookingCode);
    setTimeout(() => {
      recentlyCreatedBookingCodes.current.delete(newRental.bookingCode);
    }, 15000);

    // Update status items to rented if active
    if (newRental.status === "active") {
      setItems((prev) =>
        prev.map((it) =>
          newRental.items.some((ri) => ri.itemId === it.id)
            ? { ...it, status: "rented" }
            : it
        )
      );

      // Sync status unit ke Supabase items
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        try {
          const supabase = createClient();
          const itemIds = newRental.items.map((ri) => ri.itemId);
          (supabase as any)
            .from("items")
            .update({ status: "rented" })
            .in("id", itemIds)
            .then(({ error }: any) => {
              if (error) console.error("Gagal sync status unit baru ke Supabase items:", error);
            });
        } catch (err) {}
      }
    }

    // Sync ke Supabase Realtime jika terhubung
    try {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        const supabase = createClient();
        (supabase as any)
          .from("rentals")
          .insert(mapRentalToDb(newRental) as any)
          .then(({ error }: any) => {
            if (error) console.error("Gagal simpan rental ke Supabase:", error);
          });
      }
    } catch (e) {
      console.error("Supabase insert error:", e);
    }

    notify(`Pemesanan ${newRental.bookingCode} berhasil disimpan!`, "success");
    return newRental;
  };

  const updateRentalStatus = (
    id: string,
    newStatus: RentalTransaction["status"],
    penalty = 0,
    penaltyNotes = "",
    pelunasanData?: { method: PaymentMethod }
  ) => {
    // STRICT SECURITY: Hanya Staf Kasir atau Admin yang berhak mengubah status / menyetujui pesanan
    if (currentUser.role === "customer") {
      notify("Akses ditolak: Konsumen tidak dapat menyetujui atau mengubah status sewa sendiri!", "error");
      return;
    }

    let targetBookingCode = "";
    let targetRemaining = 0;
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          targetBookingCode = r.bookingCode;
          targetRemaining = r.remainingAmount;
          const isPelunasan = newStatus === "active" && (pelunasanData || r.remainingAmount > 0);
          return {
            ...r,
            status: newStatus,
            handledByStaffName:
              (newStatus === "confirmed" || newStatus === "active") && !r.handledByStaffName
                ? currentUser.name
                : r.handledByStaffName,
            penaltyAmount: penalty > 0 ? penalty : r.penaltyAmount,
            penaltyNotes: penaltyNotes || r.penaltyNotes,
            ...(isPelunasan
              ? {
                  remainingAmount: 0,
                  pelunasanPaid: true,
                  pelunasanMethod: pelunasanData?.method || "cash",
                  pelunasanPaidAt: new Date().toISOString(),
                }
              : {}),
          };
        }
        return r;
      })
    );

    const targetRental = rentals.find((r) => r.id === id);

    // If active (handed over to customer), mark items as rented
    if (newStatus === "active" && targetRental) {
      setItems((prev) =>
        prev.map((it) =>
          targetRental.items.some((ri) => ri.itemId === it.id)
            ? { ...it, status: "rented" }
            : it
        )
      );
    }

    // If returned or cancelled, return items to available
    if ((newStatus === "returned" || newStatus === "cancelled") && targetRental) {
      setItems((prev) =>
        prev.map((it) =>
          targetRental.items.some((ri) => ri.itemId === it.id)
            ? { ...it, status: "available" }
            : it
        )
      );
    }

    // Sync status unit alat ke Supabase Cloud
    if (targetRental && (newStatus === "active" || newStatus === "returned" || newStatus === "cancelled")) {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        try {
          const itemIds = targetRental.items.map((ri) => ri.itemId);
          const newItemStatus = newStatus === "active" ? "rented" : "available";
          const supabase = createClient();
          (supabase as any)
            .from("items")
            .update({ status: newItemStatus })
            .in("id", itemIds)
            .then(({ error }: any) => {
              if (error) console.error("Gagal sync status unit ke Supabase items:", error);
            });
        } catch (err) {}
      }
    }

    // Sync update status ke Supabase
    try {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        const supabase = createClient();
        const updatePayload: any = {
          status: newStatus,
          handled_by_staff_name:
            newStatus === "confirmed" || newStatus === "active" ? currentUser.name : undefined,
          penalty_amount: penalty > 0 ? penalty : undefined,
          penalty_notes: penaltyNotes || undefined,
          ...(newStatus === "active" && (pelunasanData || targetRemaining > 0)
            ? {
                remaining_amount: 0,
                pelunasan_paid: true,
                pelunasan_method: pelunasanData?.method || "cash",
                pelunasan_paid_at: new Date().toISOString(),
              }
            : {}),
        };
        Object.keys(updatePayload).forEach(
          (k) => updatePayload[k] === undefined && delete updatePayload[k]
        );
        (supabase as any)
          .from("rentals")
          .update(updatePayload)
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) console.error("Gagal update status di Supabase:", error);
          });
      }
    } catch (e) {
      console.error("Supabase update status error:", e);
    }

    if (newStatus === "confirmed") {
      notify(`Pesanan ${targetBookingCode || id} disetujui & dikonfirmasi oleh ${currentUser.name}! Siap diambil di toko.`, "success");
    } else if (newStatus === "active") {
      const pelunasanInfo = pelunasanData && targetRemaining > 0
        ? ` (Pelunasan Rp ${targetRemaining.toLocaleString("id-ID")} via ${pelunasanData.method.toUpperCase()} Lunas)`
        : "";
      notify(`Alat ${targetBookingCode || id} resmi diserahkan ke pendaki${pelunasanInfo}. KTP fisik asli aman disimpan di brankas!`, "success");
    } else if (newStatus === "returned") {
      notify(`Pengembalian ${targetBookingCode || id} selesai diperiksa. Jaminan KTP dikembalikan!`, "success");
    } else if (newStatus === "cancelled") {
      notify(`Pesanan ${targetBookingCode || id} telah dibatalkan & unit alat dikembalikan ke rak.`, "info");
    } else {
      notify(`Status sewa berhasil diubah menjadi ${newStatus.toUpperCase()}`, "info");
    }
  };

  const deleteRental = (id: string) => {
    if (currentUser.role !== "admin") {
      notify("Hanya Admin yang dapat menghapus data sewa!", "error");
      return;
    }
    setRentals((prev) => prev.filter((r) => r.id !== id));

    // Sync delete ke Supabase
    try {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        const supabase = createClient();
        (supabase as any)
          .from("rentals")
          .delete()
          .eq("id", id)
          .then(({ error }: any) => {
            if (error) console.error("Gagal hapus di Supabase:", error);
          });
      }
    } catch (e) {
      console.error("Supabase delete error:", e);
    }

    notify("Transaksi sewa berhasil dihapus", "info");
  };

  const resetAllRentals = async () => {
    if (currentUser.role !== "admin") {
      notify("Hanya Admin yang dapat mereset riwayat transaksi & omset!", "error");
      return;
    }

    // 1. Kosongkan state transaksi
    setRentals([]);

    // 2. Hapus data tersimpan di localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("triva_rentals");
      } catch (e) {}
    }

    // 3. Kembalikan semua status unit alat menjadi available
    setItems((prevItems) => {
      const resetItems = prevItems.map((item) => ({
        ...item,
        status: "available" as const,
      }));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("triva_custom_items", JSON.stringify(resetItems));
        } catch (e) {}
      }
      return resetItems;
    });

    // 4. Hapus data di Supabase jika terhubung
    try {
      const isSupabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isSupabaseConfigured) {
        const supabase = createClient();
        await (supabase as any)
          .from("rentals")
          .delete()
          .neq("id", "none");
      }
    } catch (e) {
      console.warn("Supabase reset warning:", e);
    }

    notify("Seluruh transaksi & omset toko berhasil direset ke Rp 0!", "success");
  };

  // Simpan setiap perubahan keranjang sewa ke localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("triva_cart", JSON.stringify(cart));
      } catch (e) {}
    }
  }, [cart]);

  const addToCart = (item: GearItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { item, qty: 1 }];
    });
    notify(`🛒 "${item.name}" ditambahkan ke keranjang!`, "success");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, qty } : c))
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("triva_cart");
      } catch (e) {}
    }
  };

  const checkoutFromCart = (dates?: { startDate: string; endDate: string }) => {
    if (dates) {
      setPreselectedDates(dates);
    }
    setIsCartDrawerOpen(false);
    setPreselectedItem(null);
    setShowNewRentalModal(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        demoUsers: INITIAL_DEMO_USERS,
        switchUser,
        categories,
        items,
        rentals,
        settings,
        notification,
        notify,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        showNewRentalModal,
        setShowNewRentalModal,
        preselectedItem,
        openNewRentalModalWithItem,
        showQrisModal,
        setShowQrisModal,
        editingTarget,
        setEditingTarget,
        updateItemImage,
        updateCategoryImage,
        persistCurrentPhotosToServer,
        addRental,
        updateRentalStatus,
        deleteRental,
        resetAllRentals,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        preselectedDates,
        setPreselectedDates,
        setPreselectedItem,
        clearPreselected,
        checkoutFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
