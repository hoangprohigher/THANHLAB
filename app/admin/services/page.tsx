"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminServicesPage() {
  const { data, mutate } = useSWR("/api/admin/services", fetcher);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  async function addService() {
    await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, description, price }) });
    setName(""); setSlug(""); setDescription(""); setPrice(0);
    mutate();
  }

  async function removeService(id: string) {
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý dịch vụ</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="border rounded px-2 py-1" type="number" placeholder="Giá" value={Number(price)} onChange={(e) => setPrice(Number(e.target.value))} />
        <Button onClick={addService}>Thêm</Button>
      </div>
      <ul className="space-y-2">
        {(data?.items || []).map((s: any) => (
          <li key={String(s._id)} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.slug}</div>
            </div>
            <button className="text-red-600 text-sm underline" onClick={() => removeService(String(s._id))}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


