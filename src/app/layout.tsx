import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import FloatingWhatsAppAdmin from "@/components/FloatingWhatsAppAdmin";
import InstallPwaBanner from "@/components/InstallPwaBanner";

export const metadata: Metadata = {
  title: "TRIVA Outdoor — Style on the Trail",
  description: "Aplikasi Mobile CRM & Rental Alat Outdoor TRIVA",
  applicationName: "TRIVA Outdoor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TRIVA Outdoor",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
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
          <InstallPwaBanner />
        </AppProvider>
      </body>
    </html>
  );
}
