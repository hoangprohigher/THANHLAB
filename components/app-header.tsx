"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useState } from "react";


export default function AppHeader() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleUserClick = () => {
    if (session?.user?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/orders";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight">
              THANHLAB
            </Link>
          </div>
          {/* Desktop menu */}
          <nav className="hidden md:flex ml-10 space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium">Trang chủ</Link>
            <Link href="/catalog" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium">Sản phẩm</Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium">Dịch vụ</Link>
            <Link href="/posts" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium">Bài viết</Link>
          </nav>
          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Mở menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {/* User actions desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {session ? (
              <>
                {session.user?.role !== "admin" && (
                  <Link href="/cart">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25l1.5 1.5m0 0l1.5 1.5m-1.5-1.5h15.75a.75.75 0 01.75.75v15.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75h12.75" />
                      </svg>
                      <span>Giỏ hàng</span>
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleUserClick} className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name}</span>
                  {session.user?.role === "admin" && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Admin</span>
                  )}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button>Đăng ký</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-2 py-2">
            <Link href="/" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
            <Link href="/catalog" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Dịch vụ</Link>
            <Link href="/posts" className="text-gray-700 hover:text-gray-900 px-2 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Bài viết</Link>
            {session ? (
              <>
                {session.user?.role !== "admin" && (
                  <Link href="/cart" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center space-x-2 mt-2">
                      <span>Giỏ hàng</span>
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={() => {handleUserClick(); setMenuOpen(false);}} className="w-full flex items-center space-x-2 mt-2">
                  <User className="h-4 w-4 mr-1" />
                  <span>{session.user?.name}</span>
                  {session.user?.role === "admin" && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Admin</span>
                  )}
                </Button>
                <Button variant="outline" onClick={() => {handleLogout(); setMenuOpen(false);}} className="w-full flex items-center space-x-2 mt-2">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Đăng xuất</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full mt-2">Đăng nhập</Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full mt-2">Đăng ký</Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}


