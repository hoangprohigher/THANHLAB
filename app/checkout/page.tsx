"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function placeOrder() {
    // Create order from demo customer's cart
    const res = await fetch("/api/orders", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.error || "Đặt hàng thất bại");
      return;
    }
    setMessage(`Đặt hàng thành công. Mã đơn: ${data.orderId}`);
  }

  // Lấy sản phẩm đã chọn từ localStorage (giả lập)
  const [cart, setCart] = useState<any[]>([]);
  useState(() => {
    if (typeof window !== "undefined") {
      const c = localStorage.getItem("cart");
      if (c) setCart(JSON.parse(c));
    }
  });

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
      {/* Hiển thị chi tiết sản phẩm đã chọn */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <h2 className="text-lg font-bold mb-2">Sản phẩm đã chọn</h2>
        {cart.length === 0 ? (
          <div className="text-gray-400 italic">Chưa có sản phẩm nào trong giỏ hàng</div>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{item.product?.name || "Sản phẩm"} x {item.quantity}</span>
                <span className="text-red-600">{(item.product?.price * item.quantity)?.toLocaleString()} đ</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Họ tên</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-1">
          <Label>Địa chỉ</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường, quận, TP" />
        </div>
      </div>
      <Button onClick={placeOrder}>Tạo đơn hàng</Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}


