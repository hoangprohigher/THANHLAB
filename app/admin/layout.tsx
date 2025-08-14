"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Package, 
  ShoppingCart, 
  Settings, 
  FileText, 
  MessageSquare,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Danh mục", href: "/admin/categories", icon: Folder },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Dịch vụ", href: "/admin/services", icon: Settings },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Yêu cầu hỗ trợ", href: "/admin/requests", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">THANHLAB Admin</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý hệ thống</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Handle logout
              window.location.href = "/";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
