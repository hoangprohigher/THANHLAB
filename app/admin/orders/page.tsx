"use client";
import useSWR from "swr";
import { ShoppingCart, Package, DollarSign } from "lucide-react";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOrdersPage() {
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState<{[id: string]: {trackingCode: string, shippingProvider: string}}>({});

  async function updateShippingInfo(id: string) {
    const info = shippingInfo[id] || {};
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "shipping", trackingCode: info.trackingCode, shippingProvider: info.shippingProvider }),
    });
    location.reload();
  }
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
              {/* Popup chi tiết đơn hàng */}
              {detailOrder && detailOrder._id === order._id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setDetailOrder(null)}
                      title="Đóng"
                    >
                      &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h3>
                    <div className="space-y-2">
                      <div>
                        <b>Họ tên người nhận:</b>
                        <input
                          className="border rounded px-2 py-1 ml-2"
                          value={detailOrder.recipientName || ""}
                          onChange={e => setDetailOrder((o: any) => ({ ...o, recipientName: e.target.value }))}
                          placeholder="Nhập họ tên người nhận"
                        />
                      </div>
                      <div>
                        <b>Số điện thoại:</b>
                        <input
                          className="border rounded px-2 py-1 ml-2"
                          value={detailOrder.recipientPhone || ""}
                          onChange={e => setDetailOrder((o: any) => ({ ...o, recipientPhone: e.target.value }))}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div>
                        <b>Địa chỉ:</b>
                        <input
                          className="border rounded px-2 py-1 ml-2"
                          value={detailOrder.recipientAddress || ""}
                          onChange={e => setDetailOrder((o: any) => ({ ...o, recipientAddress: e.target.value }))}
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                      <div>
                        <b>Mã vận đơn:</b>
                        <input
                          className="border rounded px-2 py-1 ml-2"
                          value={detailOrder.trackingCode || ""}
                          onChange={e => setDetailOrder((o: any) => ({ ...o, trackingCode: e.target.value }))}
                          placeholder="Nhập mã vận đơn"
                        />
                      </div>
                      <div>
                        <b>Nhà vận chuyển:</b>
                        <input
                          className="border rounded px-2 py-1 ml-2"
                          value={detailOrder.shippingProvider || ""}
                          onChange={e => setDetailOrder((o: any) => ({ ...o, shippingProvider: e.target.value }))}
                          placeholder="Nhập tên nhà vận chuyển"
                        />
                      </div>
                      <div><b>Sản phẩm:</b>
                        <ul className="ml-4 list-disc">
                          {(detailOrder.items || []).map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.product?.name || item.productName || "Sản phẩm"} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div><b>Tổng tiền:</b> {detailOrder.total?.toLocaleString()} đ</div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                      <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={async () => {
                          await fetch(`/api/admin/orders`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: detailOrder._id,
                              recipientName: detailOrder.recipientName,
                              recipientPhone: detailOrder.recipientPhone,
                              recipientAddress: detailOrder.recipientAddress,
                              trackingCode: detailOrder.trackingCode,
                              shippingProvider: detailOrder.shippingProvider,
                              status: order.status
                            })
                          });
                          setDetailOrder(null);
                          location.reload();
                        }}
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={() => setDetailOrder(null)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mb-2"
                  onClick={() => setDetailOrder(order)}
                >
                  Chi tiết
                </button>
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
                  title="Cập nhật trạng thái đơn hàng"
                >
                  <option value="pending">Đơn mới</option>
                  <option value="confirmed">Xác nhận đơn</option>
                  <option value="waiting">Chờ gửi hàng</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Giao thành công</option>
                  <option value="canceled">Đã hủy</option>
                </select>
                {/* Nếu trạng thái là 'shipping', hiển thị form nhập thông tin vận chuyển */}
                {order.status === "shipping" && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <input
                      className="mb-2 w-full border rounded px-2 py-1 text-sm"
                      placeholder="Mã vận đơn"
                      value={shippingInfo[order._id]?.trackingCode || order.trackingCode || ""}
                      onChange={e => setShippingInfo((info: any) => ({
                        ...info,
                        [order._id]: {
                          ...info[order._id],
                          trackingCode: e.target.value
                        }
                      }))}
                    />
                    <input
                      className="mb-2 w-full border rounded px-2 py-1 text-sm"
                      placeholder="Nhà vận chuyển"
                      value={shippingInfo[order._id]?.shippingProvider || order.shippingProvider || ""}
                      onChange={e => setShippingInfo((info: any) => ({
                        ...info,
                        [order._id]: {
                          ...info[order._id],
                          shippingProvider: e.target.value
                        }
                      }))}
                    />
                    <button
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => updateShippingInfo(order._id)}
                    >
                      Cập nhật thông tin vận chuyển
                    </button>
                  </div>
                )}
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
              {/* Popup chi tiết đơn hàng */}
              {detailOrder && detailOrder._id === order._id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setDetailOrder(null)}
                      title="Đóng"
                    >
                      &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h3>
                    <div className="space-y-2">
                      <div>
                        <b>Họ tên người nhận:</b>
            <input
              className="border rounded px-2 py-1 ml-2"
              value={detailOrder.recipientName || ""}
              onChange={e => setDetailOrder((o: any) => ({ ...o, recipientName: e.target.value }))}
              placeholder="Nhập họ tên người nhận"
            />
                      </div>
                      <div>
                        <b>Số điện thoại:</b>
            <input
              className="border rounded px-2 py-1 ml-2"
              value={detailOrder.recipientPhone || ""}
              onChange={e => setDetailOrder((o: any) => ({ ...o, recipientPhone: e.target.value }))}
              placeholder="Nhập số điện thoại"
            />
                      </div>
                      <div>
                        <b>Địa chỉ:</b>
            <input
              className="border rounded px-2 py-1 ml-2"
              value={detailOrder.recipientAddress || ""}
              onChange={e => setDetailOrder((o: any) => ({ ...o, recipientAddress: e.target.value }))}
              placeholder="Nhập địa chỉ"
            />
                      </div>
                      <div>
                        <b>Mã vận đơn:</b>
            <input
              className="border rounded px-2 py-1 ml-2"
              value={detailOrder.trackingCode || ""}
              onChange={e => setDetailOrder((o: any) => ({ ...o, trackingCode: e.target.value }))}
              placeholder="Nhập mã vận đơn"
            />
                      </div>
                      <div>
                        <b>Nhà vận chuyển:</b>
            <input
              className="border rounded px-2 py-1 ml-2"
              value={detailOrder.shippingProvider || ""}
              onChange={e => setDetailOrder((o: any) => ({ ...o, shippingProvider: e.target.value }))}
              placeholder="Nhập tên nhà vận chuyển"
            />
                      </div>
                      <div><b>Sản phẩm:</b>
                        <ul className="ml-4 list-disc">
                          {(detailOrder.items || []).map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.product?.name || item.productName || "Sản phẩm"} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div><b>Tổng tiền:</b> {detailOrder.total?.toLocaleString()} đ</div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                      <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={async () => {
                          await fetch(`/api/admin/orders`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: detailOrder._id,
                              recipientName: detailOrder.recipientName,
                              recipientPhone: detailOrder.recipientPhone,
                              recipientAddress: detailOrder.recipientAddress,
                              trackingCode: detailOrder.trackingCode,
                              shippingProvider: detailOrder.shippingProvider,
                              status: order.status
                            })
                          });
                          setDetailOrder(null);
                          location.reload();
                        }}
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={() => setDetailOrder(null)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                <button
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm mb-2"
                  onClick={() => setDetailOrder(order)}
                >
                  Chi tiết
                </button>
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


