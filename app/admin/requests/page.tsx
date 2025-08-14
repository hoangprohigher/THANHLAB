"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminRequestsPage() {
  const { data, mutate } = useSWR("/api/admin/requests", fetcher);

  async function update(id: string, status: string) {
    await fetch("/api/admin/requests", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý yêu cầu hỗ trợ</h1>
      <ul className="space-y-2">
        {(data?.items || []).map((r: any) => (
          <li key={String(r._id)} className="border rounded p-3">
            <div className="font-medium">{r.content}</div>
            <div className="text-xs text-muted-foreground">{r.status}</div>
            <div className="mt-2 flex gap-2 text-sm">
              <button className="underline" onClick={() => update(String(r._id), "in_progress")}>Đang xử lý</button>
              <button className="underline" onClick={() => update(String(r._id), "resolved")}>Đã xử lý</button>
              <button className="underline" onClick={() => update(String(r._id), "closed")}>Đóng</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


