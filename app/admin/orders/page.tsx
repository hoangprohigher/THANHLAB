"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOrdersPage() {
  const { data } = useSWR("/api/admin/orders", fetcher);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
      <ul className="space-y-2">
        {(data?.items || []).map((o: any) => (
          <li key={String(o._id)} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">#{String(o._id).slice(-6)}</div>
              <div className="text-xs text-muted-foreground">{o.items?.length} sản phẩm · {o.status}</div>
            </div>
            <div className="font-semibold">{o.total.toLocaleString()} đ</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


