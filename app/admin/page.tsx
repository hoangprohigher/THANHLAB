"use client";
import React from "react";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, ShoppingCart, Package, MessageSquare } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboardPage() {
	// Slide Images State
	const { data: slideImages, mutate } = useSWR("/api/slide-images", fetcher);
	const [showAdd, setShowAdd] = React.useState(false);
	const [url, setUrl] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	async function handleAddImage(e: React.FormEvent) {
		e.preventDefault();
		if (!url) return;
		setLoading(true);
		await fetch("/api/slide-images", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ url }),
		});
		setUrl("");
		setShowAdd(false);
		setLoading(false);
		mutate();
	}

	async function handleDeleteImage(id: string) {
		setLoading(true);
		await fetch("/api/slide-images", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		setLoading(false);
		mutate();
	}
	const { data } = useSWR("/api/admin/metrics", fetcher, { refreshInterval: 5000 });
	const stats = data?.stats || { users: 0, orders: 0, products: 0, requests: 0 };
	const chart = (data?.revenue || []).map((d: any) => ({ date: d._id, revenue: d.revenue }));

	// Mock data for additional charts
	const categoryData = [
		{ name: "Linh kiện", value: 45 },
		{ name: "Robot", value: 30 },
		{ name: "Cảm biến", value: 15 },
		{ name: "Bảng mạch", value: 10 },
	];

	const monthlyOrders = [
		{ month: "T1", orders: 12 },
		{ month: "T2", orders: 19 },
		{ month: "T3", orders: 15 },
		{ month: "T4", orders: 22 },
		{ month: "T5", orders: 18 },
		{ month: "T6", orders: 25 },
	];

	return (
			<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Bảng điều khiển tổng quan</h2>
				<div className="text-sm text-gray-500">
					Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Users className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
							<p className="text-2xl font-bold text-gray-900">{stats.users}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<ShoppingCart className="h-6 w-6 text-green-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
							<p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Package className="h-6 w-6 text-purple-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
							<p className="text-2xl font-bold text-gray-900">{stats.products}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
					<div className="flex items-center">
						<div className="p-2 bg-orange-100 rounded-lg">
							<MessageSquare className="h-6 w-6 text-orange-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">Yêu cầu hỗ trợ</p>
							<p className="text-2xl font-bold text-gray-900">{stats.requests}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Revenue Chart */}
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
						<TrendingUp className="h-5 w-5 mr-2 text-green-600" />
						Doanh thu theo ngày
					</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chart} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip formatter={(value) => [`${value} VNĐ`, "Doanh thu"]} />
								<Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Orders Chart */}
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng theo tháng</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={monthlyOrders} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="orders" fill="#3b82f6" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Category Distribution */}
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố danh mục</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{categoryData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
						<div className="space-y-8">
							{/* Slide Images Management */}
							<div className="bg-white rounded-lg shadow p-6 mb-6">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-xl font-bold text-gray-900">Ảnh slideshow trang chính</h2>
									<button
										className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
										onClick={() => setShowAdd((v) => !v)}
									>
										{showAdd ? "Đóng" : "Thêm ảnh"}
									</button>
								</div>
								{showAdd && (
									<form className="flex gap-2 mb-4" onSubmit={handleAddImage}>
										<input
											type="url"
											className="border rounded px-3 py-2 flex-1"
											placeholder="Nhập URL ảnh..."
											value={url}
											onChange={(e) => setUrl(e.target.value)}
											required
										/>
										<button
											type="submit"
											className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
											disabled={loading}
										>
											Lưu
										</button>
									</form>
								)}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{slideImages?.map((img: any) => (
										<div key={img._id} className="relative group border rounded overflow-hidden">
											<img src={img.url} alt="slide" className="w-full h-32 object-cover" />
											<button
												className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
												onClick={() => handleDeleteImage(img._id)}
												disabled={loading}
											>
												Xóa
											</button>
										</div>
									))}
									{slideImages?.length === 0 && <div className="text-gray-500">Chưa có ảnh nào</div>}
								</div>
							</div>
						<div className="flex items-center text-sm">
							<div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
							<span className="text-gray-600">Đơn hàng mới #12345</span>
							<span className="ml-auto text-gray-400">2 phút trước</span>
						</div>
						<div className="flex items-center text-sm">
							<div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
							<span className="text-gray-600">Người dùng mới đăng ký</span>
							<span className="ml-auto text-gray-400">15 phút trước</span>
						</div>
						<div className="flex items-center text-sm">
							<div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
							<span className="text-gray-600">Yêu cầu hỗ trợ mới</span>
							<span className="ml-auto text-gray-400">1 giờ trước</span>
						</div>
						<div className="flex items-center text-sm">
							<div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
							<span className="text-gray-600">Sản phẩm mới được thêm</span>
							<span className="ml-auto text-gray-400">2 giờ trước</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


