"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function AppHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleUserClick = () => {
    if (session?.user?.role === "admin") {
      window.location.href = "/admin";
    } else {
      // For customers, could redirect to profile or orders page
      window.location.href = "/orders";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight">
              THANHLAB
            </Link>
            <nav className="ml-10 flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Trang chủ
              </Link>
              <Link href="/catalog" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Sản phẩm
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dịch vụ
              </Link>
              <Link href="/posts" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Bài viết
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleUserClick}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{session.user?.name}</span>
                  {session.user?.role === "admin" && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
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
      </div>
    </header>
  );
}


