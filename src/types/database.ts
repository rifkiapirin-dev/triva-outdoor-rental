export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "staff" | "customer";
export type ItemStatus = "available" | "rented" | "maintenance";
export type RentalStatus =
  | "pending_dp"
  | "confirmed"
  | "active"
  | "returned"
  | "cancelled";
export type PaymentMethod = "cash" | "transfer" | "qris";
export type PaymentType = "dp" | "settlement" | "penalty";
export type PenaltyType = "late" | "damage" | "missing" | "cleaning";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone_wa: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone_wa?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone_wa?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          unit_code: string;
          category_id: string;
          name: string;
          price_per_day: number;
          status: ItemStatus;
          image_url: string | null;
          condition_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_code: string;
          category_id: string;
          name: string;
          price_per_day: number;
          status?: ItemStatus;
          image_url?: string | null;
          condition_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          unit_code?: string;
          category_id?: string;
          name?: string;
          price_per_day?: number;
          status?: ItemStatus;
          image_url?: string | null;
          condition_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rentals: {
        Row: {
          id: string;
          booking_code: string;
          customer_id: string;
          handled_by: string | null;
          start_date: string;
          end_date: string;
          total_amount: number;
          down_payment: number;
          remaining_amount: number;
          status: RentalStatus;
          ktp_photo_path: string | null;
          notes: string | null;
          actual_return_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_code?: string;
          customer_id: string;
          handled_by?: string | null;
          start_date: string;
          end_date: string;
          total_amount: number;
          down_payment?: number;
          remaining_amount?: number;
          status?: RentalStatus;
          ktp_photo_path?: string | null;
          notes?: string | null;
          actual_return_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_code?: string;
          customer_id?: string;
          handled_by?: string | null;
          start_date?: string;
          end_date?: string;
          total_amount?: number;
          down_payment?: number;
          remaining_amount?: number;
          status?: RentalStatus;
          ktp_photo_path?: string | null;
          notes?: string | null;
          actual_return_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rental_items: {
        Row: {
          id: string;
          rental_id: string;
          item_id: string;
          price_per_day: number;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_id: string;
          item_id: string;
          price_per_day: number;
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rental_id?: string;
          item_id?: string;
          price_per_day?: number;
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          rental_id: string;
          method: PaymentMethod;
          type: PaymentType;
          amount: number;
          proof_path: string | null;
          verified_by: string | null;
          verified_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_id: string;
          method: PaymentMethod;
          type: PaymentType;
          amount: number;
          proof_path?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          rental_id?: string;
          method?: PaymentMethod;
          type?: PaymentType;
          amount?: number;
          proof_path?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      penalties: {
        Row: {
          id: string;
          rental_id: string;
          type: PenaltyType;
          amount: number;
          notes: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_id: string;
          type: PenaltyType;
          amount: number;
          notes: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          rental_id?: string;
          type?: PenaltyType;
          amount?: number;
          notes?: string;
          created_by?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          key: string;
          value: string;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      item_status: ItemStatus;
      rental_status: RentalStatus;
      payment_method: PaymentMethod;
      payment_type: PaymentType;
      penalty_type: PenaltyType;
    };
  };
}
