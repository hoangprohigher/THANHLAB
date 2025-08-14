import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AppSessionProvider from "@/components/providers/session-provider";
import AppHeader from "@/components/app-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THANHLAB - Thương mại điện tử & Hỗ trợ đồ án",
  description: "Nền tảng thương mại điện tử và dịch vụ hỗ trợ đồ án của THANHLAB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppSessionProvider>
          <AppHeader />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="w-full border-t py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} THANHLAB. All rights reserved.
          </footer>
        </AppSessionProvider>
      </body>
    </html>
  );
}
