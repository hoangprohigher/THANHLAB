"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCartAndSelected() {
      let cartObj: any = null;
      let selectedIdx: number[] = [];
      if (typeof window !== "undefined") {
        const selected = localStorage.getItem("selectedCartItems");
        if (selected) selectedIdx = JSON.parse(selected);
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          cartObj = JSON.parse(cartData);
        } else {
          // Nếu không có cart trong localStorage, gọi API lấy lại
          const res = await fetch("/api/cart");
          const data = await res.json();
          if (data.ok && data.cart) cartObj = data.cart;
        }
        let items: any[] = [];
        if (cartObj && selectedIdx.length > 0) {
          items = selectedIdx.map((idx: number) => cartObj.items[idx]).filter(Boolean);
        }
        setCart(items);
      }
    }
    fetchCartAndSelected();
  }, []);

  async function placeOrder() {
    if (cart.length === 0) return;
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        address,
        items: cart.map((item: any) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.error || "Đặt hàng thất bại");
      return;
    }
    setMessage(`Đặt hàng thành công. Mã đơn: ${data.orderId}`);
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedCartItems");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <h2 className="text-lg font-bold mb-2">Sản phẩm đã chọn</h2>
        {cart.length === 0 ? (
          <div className="text-gray-400 italic">Chưa có sản phẩm nào trong giỏ hàng</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Sản phẩm</th>
                  <th className="p-2 text-center">Đơn giá</th>
                  <th className="p-2 text-center">Số lượng</th>
                  <th className="p-2 text-center">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 flex items-center gap-3">
                      <img src={item.product?.images?.[0] || "/file.svg"} alt="sp" className="w-12 h-12 object-cover rounded border" />
                      <div>
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-xs text-gray-500">{item.product?.category?.name || ""}</div>
                      </div>
                    </td>
                    <td className="p-2 text-center">{(item.product?.price || 0).toLocaleString()} đ</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center font-semibold">{((item.product?.price || 0) * item.quantity).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold mt-4">Tổng cộng: <span className="text-red-600">{cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0).toLocaleString()} đ</span></div>
          </div>
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
      <Button onClick={placeOrder} disabled={cart.length === 0}>Tạo đơn hàng</Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}


