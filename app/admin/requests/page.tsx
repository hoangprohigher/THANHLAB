"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminRequestsPage() {
  const { data, mutate } = useSWR("/api/admin/requests", fetcher);

  async function update(id: string, status: string, adminReply?: string) {
    await fetch("/api/admin/requests", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status, adminReply }) });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý yêu cầu hỗ trợ</h1>
      <ul className="space-y-2">
        {(data?.items || []).map((r: any) => (
          <li key={String(r._id)} className="border rounded p-3 space-y-2">
            <div className="font-medium">{r.content}</div>
            <div className="text-xs text-muted-foreground">{r.status}</div>
            <form className="flex items-center gap-2 text-sm" onSubmit={(e) => { e.preventDefault(); const reply=(e.currentTarget.elements.namedItem('reply') as HTMLInputElement).value; update(String(r._id), r.status, reply); }}>
              <input name="reply" className="border rounded px-2 py-1 flex-1" placeholder="Phản hồi admin" defaultValue={r.adminReply || ""} />
              <button className="underline" type="submit">Lưu phản hồi</button>
            </form>
            <div className="flex gap-2 text-sm">
              <button className="underline" onClick={() => update(String(r._id), "in_progress", r.adminReply)}>Đang xử lý</button>
              <button className="underline" onClick={() => update(String(r._id), "resolved", r.adminReply)}>Đã xử lý</button>
              <button className="underline" onClick={() => update(String(r._id), "closed", r.adminReply)}>Đóng</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


