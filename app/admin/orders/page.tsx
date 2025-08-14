"use client";
import useSWR from "swr";
import { ShoppingCart, Package, DollarSign } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOrdersPage() {
  const { data } = useSWR("/api/admin/orders", fetcher);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} đơn hàng
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách đơn hàng</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((order: any) => (
            <div key={String(order._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">#{String(order._id).slice(-6)}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {order.items?.length || 0} sản phẩm
                  </div>
                  <div className="text-xs text-gray-400 capitalize">{order.status}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {order.total?.toLocaleString()} đ
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


