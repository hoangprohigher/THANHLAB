"use client";
import useSWR from "swr";
import { ShoppingCart, Package, DollarSign } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOrdersPage() {
  const { data } = useSWR("/api/admin/orders", fetcher);
  
  // Tách đơn hàng thành 2 nhóm
  const processingOrders = (data?.items || []).filter((order: any) => order.status !== "completed" && order.status !== "canceled");
  const completedOrders = (data?.items || []).filter((order: any) => order.status === "completed");

  // Hàm cập nhật trạng thái đơn hàng
  async function updateOrderStatus(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    location.reload(); // reload lại để cập nhật UI
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} đơn hàng
        </div>
      </div>

      {/* Đơn hàng đang xử lý */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Đơn hàng đang xử lý</h3>
        </div>
        <div className="divide-y">
          {processingOrders.length === 0 && (
            <div className="px-6 py-4 text-gray-400 italic">Không có đơn hàng đang xử lý</div>
          )}
          {processingOrders.map((order: any) => (
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
              <div className="text-right space-y-2">
                <div className="font-semibold text-green-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {order.total?.toLocaleString()} đ
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </div>
                {/* Dropdown cập nhật trạng thái */}
                <select
                  className="mt-2 border rounded px-2 py-1 text-sm"
                  value={order.status}
                  onChange={e => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="pending">Đơn mới</option>
                  <option value="confirmed">Xác nhận đơn</option>
                  <option value="waiting">Chờ gửi hàng</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Giao thành công</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Đơn hàng hoàn thành */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Đơn hàng hoàn thành</h3>
        </div>
        <div className="divide-y">
          {completedOrders.length === 0 && (
            <div className="px-6 py-4 text-gray-400 italic">Chưa có đơn hàng hoàn thành</div>
          )}
          {completedOrders.map((order: any) => (
            <div key={String(order._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
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


