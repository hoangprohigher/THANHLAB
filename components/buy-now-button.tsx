"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BuyNowButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleBuyNow() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("buyNowProductId", productId);
        router.push("/cart");
      } else {
        alert(data.error || "Thêm vào giỏ hàng thất bại!");
      }
    } catch {
      alert("Có lỗi xảy ra khi mua ngay!");
    }
    setLoading(false);
  }
  return (
    <Button onClick={handleBuyNow} disabled={loading} size="sm" className="bg-green-600 text-white hover:bg-green-700">
      {loading ? "Đang xử lý..." : "Mua ngay"}
    </Button>
  );
}
