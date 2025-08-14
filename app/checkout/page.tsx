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

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
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
      <Button onClick={placeOrder}>Đặt hàng</Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}


