"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  async function add() {
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLoading(false);
  }
  return (
    <Button onClick={add} disabled={loading} size="sm">
      {loading ? "Đang thêm..." : "Thêm vào giỏ"}
    </Button>
  );
}

export function CartItemControls({ productId, initialQty, onChanged }: { productId: string; initialQty: number; onChanged?: () => void }) {
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
      <Button size="sm" variant="outline" onClick={remove} disabled={loading}>
        Xóa
      </Button>
    </div>
  );
}


