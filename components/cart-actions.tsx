"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  async function add() {
    setLoading(true);
    if (session?.user) {
      // User đã đăng nhập, gọi API như cũ
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 }),
        });
        const data = await res.json();
        if (data.ok) {
          alert("Đã thêm sản phẩm vào giỏ hàng!");
        } else {
          alert(data.error || "Thêm vào giỏ hàng thất bại!");
        }
      } catch (err) {
        alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } else {
      // Khách chưa đăng nhập, lưu vào localStorage
      try {
        const guestCart = JSON.parse(localStorage.getItem("guest-cart") || "[]");
        const idx = guestCart.findIndex((item: any) => item.productId === productId);
        if (idx >= 0) {
          guestCart[idx].quantity += 1;
        } else {
          guestCart.push({ productId, quantity: 1 });
        }
        localStorage.setItem("guest-cart", JSON.stringify(guestCart));
        alert("Đã thêm sản phẩm vào giỏ hàng tạm!");
      } catch (err) {
        alert("Có lỗi khi lưu giỏ hàng tạm!");
      }
    }
    setLoading(false);
  }
  return (
    <Button onClick={add} disabled={loading} size="sm">
      {loading ? "Đang thêm..." : "Thêm vào giỏ"}
    </Button>
  );
}

export function CartItemControls({ productId, initialQty, onChanged, hideDelete }: { productId: string; initialQty: number; onChanged?: () => void; hideDelete?: boolean }) {
  const [qty, setQty] = useState<number>(initialQty);
  const [loading, setLoading] = useState(false);

  async function updateQty(newQty: number) {
    setLoading(true);
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: newQty }),
    });
    setLoading(false);
    onChanged?.();
  }

  async function remove() {
    setLoading(true);
    await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
    setLoading(false);
    onChanged?.();
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        className="w-20 h-8"
        value={Number(qty)}
        onChange={(e) => setQty(Number(e.target.value))}
        min={1}
      />
      <Button size="sm" onClick={() => updateQty(qty)} disabled={loading}>
        Cập nhật
      </Button>
      {!hideDelete && (
        <Button size="sm" variant="outline" onClick={remove} disabled={loading}>
          Xóa
        </Button>
      )}
    </div>
  );
}


