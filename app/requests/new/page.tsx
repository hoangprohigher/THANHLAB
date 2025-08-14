"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewSupportRequestPage() {
  const { data: services } = useSWR("/api/admin/services", fetcher);
  const [serviceId, setServiceId] = useState<string>("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setMessage(null);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, content }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Đã gửi yêu cầu hỗ trợ." : data?.error || "Thất bại");
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-semibold">Gửi yêu cầu hỗ trợ đồ án</h1>
      <div className="space-y-1">
        <Label>Dịch vụ</Label>
        <select className="border rounded px-2 py-2 w-full" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">-- Chọn dịch vụ --</option>
          {(services?.items || []).map((s: any) => (
            <option key={String(s._id)} value={String(s._id)}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label>Nội dung</Label>
        <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mô tả yêu cầu" />
      </div>
      <Button onClick={submit}>Gửi yêu cầu</Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}


