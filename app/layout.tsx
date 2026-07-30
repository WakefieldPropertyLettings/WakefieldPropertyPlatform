import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JasmineChatbot from "@/components/JasmineChatbot";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Wakefield Property Lettings",
  description:
    "Professional property lettings services in Wakefield and surrounding areas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Navbar />

        {/* Prevent content from being hidden behind the fixed navbar */}
        <main className="min-h-screen pt-[82px]">
          {children}
        </main>

        <Footer />

        <JasmineChatbot />
        <CookieConsent />
      </body>
    </html>
    
  );
}