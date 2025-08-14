"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QRPaymentPage() {
  const [amount, setAmount] = useState("100000");
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function generateQR() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/payments/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setQrData(data);
        setMessage("QR code đã được tạo. Quét để thanh toán.");
      } else {
        setMessage(data?.error || "Tạo QR code thất bại");
      }
    } catch (error) {
      setMessage("Lỗi kết nối");
    }
    setLoading(false);
  }

  async function confirmPayment() {
    if (!qrData?.orderId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: qrData.orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Thanh toán thành công! Đơn hàng đã được xác nhận.");
      } else {
        setMessage(data?.error || "Xác nhận thanh toán thất bại");
      }
    } catch (error) {
      setMessage("Lỗi kết nối");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán QR Code</h1>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Số tiền (VNĐ)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100000"
          />
        </div>
        <Button onClick={generateQR} disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo QR Code"}
        </Button>
      </div>

      {qrData && (
        <div className="space-y-4 border rounded p-4">
          <div className="text-center">
            <img src={qrData.qrDataUrl} alt="QR Code" className="mx-auto" />
          </div>
          <div className="text-sm space-y-1">
            <div>Mã đơn: {qrData.orderId}</div>
            <div>Số tiền: {qrData.amount.toLocaleString()} đ</div>
            <div>Payload: {qrData.payload}</div>
          </div>
          <Button 
            onClick={confirmPayment} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? "Đang xác nhận..." : "Xác nhận thanh toán"}
          </Button>
        </div>
      )}

      {message && (
        <div className={`p-3 rounded text-sm ${
          message.includes("thành công") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}


