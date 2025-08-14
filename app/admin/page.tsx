"use client";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboardPage() {
	const { data } = useSWR("/api/admin/metrics", fetcher, { refreshInterval: 5000 });
	const stats = data?.stats || { users: 0, orders: 0, products: 0, requests: 0 };
	const chart = (data?.revenue || []).map((d: any) => ({ date: d._id, revenue: d.revenue }));
	return (
		<div className="space-y-8">
			<h1 className="text-xl font-semibold">Bảng điều khiển (Realtime)</h1>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="border rounded p-4"><div className="text-sm text-muted-foreground">Người dùng</div><div className="text-2xl font-semibold">{stats.users}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-muted-foreground">Đơn hàng</div><div className="text-2xl font-semibold">{stats.orders}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-muted-foreground">Sản phẩm</div><div className="text-2xl font-semibold">{stats.products}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-muted-foreground">Yêu cầu</div><div className="text-2xl font-semibold">{stats.requests}</div></div>
			</div>
			<div className="h-64 w-full border rounded p-2">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chart} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}


