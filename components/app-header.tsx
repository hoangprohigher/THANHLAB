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
    <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="font-bold text-lg">THANHLAB</span>
        </Link>
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
