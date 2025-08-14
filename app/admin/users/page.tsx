"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminUsersPage() {
  const { data, mutate } = useSWR("/api/admin/users", fetcher);

  async function promote(id: string) {
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role: "admin" }) });
    mutate();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>
      <ul className="space-y-2">
        {(data?.items || []).map((u: any) => (
          <li key={String(u._id)} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-muted-foreground">{u.email} · {u.role}</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {u.role !== "admin" && <button className="underline" onClick={() => promote(String(u._id))}>Nâng quyền Admin</button>}
              <button className="text-red-600 underline" onClick={() => remove(String(u._id))}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


