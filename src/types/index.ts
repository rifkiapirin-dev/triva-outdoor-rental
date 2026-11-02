export type UserRole = "admin" | "staff" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneWa: string;
  role: UserRole;
  avatarUrl?: string;
}

export type ItemStatus = "available" | "rented" | "maintenance";

export interface GearCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  imageUrl?: string;
  sublabel?: string;
  hasFlashSale?: boolean;
}

export interface GearItem {
  id: string;
  unitCode: string; // TND-01, CR-01
  categoryId: string;
  categoryName: string;
  name: string;
  pricePerDay: number;
  status: ItemStatus;
  imageUrl?: string;
  conditionNotes?: string;
}

export type RentalStatus =
  | "pending_dp"
  | "confirmed"
  | "active"
  | "returned"
  | "cancelled";

export type PaymentMethod = "cash" | "transfer" | "qris";

export interface RentalItem {
  itemId: string;
  unitCode: string;
  name: string;
  pricePerDay: number;
  qty: number;
}

export interface CartItem {
  item: GearItem;
  qty: number;
}

export interface RentalTransaction {
  id: string;
  bookingCode: string; // TRV-261030-001
  customerId: string;
  customerName: string;
  customerPhone: string;
  handledByStaffName?: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  items: RentalItem[];
  totalAmount: number;
  downPayment: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  status: RentalStatus;
  ktpPhotoUrl?: string;
  idCardType: "KTP Asli" | "SIM" | "Kartu Mahasiswa";
  notes?: string;
  penaltyAmount?: number;
  penaltyNotes?: string;
  pelunasanPaid?: boolean;
  pelunasanMethod?: PaymentMethod;
  pelunasanPaidAt?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storePhoneWa: string;
  storeAddress: string;
  minDpPercentage: number;
  lateFeePerDay: number;
  returnDeadlineHour: string;
}
