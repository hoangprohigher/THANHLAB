"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QRCheckoutPage() {
  const [amount, setAmount] = useState(100000);
  const [qr, setQr] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function createQr() {
    const res = await fetch("/api/payments/qr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
    const data = await res.json();
    if (res.ok) {
      setQr(data.qrDataUrl);
      setOrderId(data.orderId);
    }
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-xl font-semibold">Thanh toán QR (Giả lập)</h1>
      <div className="space-y-1">
        <Label>Số tiền (VND)</Label>
        <Input type="number" value={Number(amount)} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <Button onClick={createQr}>Tạo QR</Button>
      {qr && (
        <div className="space-y-3">
          <img src={qr} alt="QR" className="w-64 h-64" />
          <p className="text-sm">Mã đơn: {orderId}</p>
        </div>
      )}
    </div>
  );
}


