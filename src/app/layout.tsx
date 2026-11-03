import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import FloatingWhatsAppAdmin from "@/components/FloatingWhatsAppAdmin";

export const metadata: Metadata = {
  title: "TRIVA Outdoor — Style on the Trail",
  description: "Aplikasi Mobile CRM & Rental Alat Outdoor TRIVA",
  icons: {
    icon: "/triva-logo.png",
    apple: "/triva-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#851919",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-triva-crimson selection:text-white">
        <AppProvider>
          {children}
          <FloatingWhatsAppAdmin />
        </AppProvider>
      </body>
    </html>
  );
}
