"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useState } from "react";

function AppHeader() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleUserClick = () => {
    if (session?.user?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/profile";
    }
  };
  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="bg-white shadow-md px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-12 w-full">
        <Link href="/">
          <span className="font-extrabold text-2xl tracking-wide text-blue-700">THANHLAB</span>
        </Link>
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-10">
            <li>
              <Link href="/" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">Trang chủ</Link>
            </li>
            <li>
              <Link href="/catalog" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">Sản phẩm</Link>
            </li>
            <li>
              <Link href="/services" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">Dịch vụ</Link>
            </li>
            <li>
              <Link href="/posts" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">Bài viết</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        {session ? (
          <div className="flex items-center space-x-2">
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
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/guest-cart">
              <Button variant="outline" className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25l1.5 1.5m0 0l1.5 1.5m-1.5-1.5h15.75a.75.75 0 01.75.75v15.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75h12.75" />
                </svg>
                <span>Giỏ hàng tạm</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button>Đăng ký</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
