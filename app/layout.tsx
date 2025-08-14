import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
        <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              THANHLAB
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:underline">
                Trang chủ
              </Link>
              <Link href="#san-pham" className="hover:underline">
                Sản phẩm
              </Link>
              <Link href="#dich-vu" className="hover:underline">
                Dịch vụ
              </Link>
              <Link href="#bai-viet" className="hover:underline">
                Bài viết
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="w-full border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} THANHLAB. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
