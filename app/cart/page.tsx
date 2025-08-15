"use client";
import { CartItemControls } from "@/components/cart-actions";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function CartPage() {
	const [cart, setCart] = useState<any>(null);
	const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
	const [selected, setSelected] = useState<number[]>([]);
	useEffect(() => {
		async function fetchCart() {
			const res = await fetch("/api/cart");
			const data = await res.json();
			setCart(data);
		}
		fetchCart();
	}, []);
	const items = cart?.cart?.items || [];
	const total = selected.length === 0
		? 0
		: selected.reduce((sum, idx) => sum + ((items[idx]?.product?.price || 0) * items[idx]?.quantity), 0);
	async function handleRemove(productId: string, idx: number) {
		setLoadingIdx(idx);
		await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
		const res = await fetch("/api/cart");
		const data = await res.json();
		setCart(data);
		setLoadingIdx(null);
	}
	return (
		<div className="max-w-5xl mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
			{!items.length ? (
				<p>Chưa có sản phẩm.</p>
			) : (
				<form>
					<table className="w-full border rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-3 text-left">
									<input
										type="checkbox"
										checked={selected.length === items.length && items.length > 0}
										onChange={e => {
											if (e.target.checked) {
												setSelected(items.map((item: any, idx: number) => idx));
											} else {
												setSelected([]);
											}
										}}
									/>
								</th>
								<th className="p-3 text-left">Sản phẩm</th>
								<th className="p-3 text-center">Đơn giá</th>
								<th className="p-3 text-center">Số lượng</th>
								<th className="p-3 text-center">Số tiền</th>
								<th className="p-3 text-center">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{items.map((it: any, idx: number) => (
								<tr key={idx} className="border-b">
									<td className="p-3 text-center">
										<input
											type="checkbox"
											checked={selected.includes(idx)}
											onChange={e => {
												if (e.target.checked) {
													setSelected(sel => [...sel, idx]);
												} else {
													setSelected(sel => sel.filter(i => i !== idx));
												}
											}}
										/>
									</td>
									<td className="p-3 flex items-center gap-3">
										<img src={it.product?.images?.[0] || "/file.svg"} alt="sp" className="w-16 h-16 object-cover rounded border" />
										<div>
											<div className="font-medium">{it.product?.name}</div>
											<div className="text-xs text-gray-500">{it.product?.category?.name || ""}</div>
										</div>
									</td>
									<td className="p-3 text-center font-semibold">{(it.product?.price || 0).toLocaleString()} đ</td>
									<td className="p-3 text-center">
										<CartItemControls productId={String(it.product?._id)} initialQty={it.quantity} hideDelete />
									</td>
									<td className="p-3 text-center font-semibold">{((it.product?.price || 0) * it.quantity).toLocaleString()} đ</td>
									<td className="p-3 text-center">
										<button
											type="button"
											className="flex items-center gap-1 px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600 transition"
											onClick={() => handleRemove(String(it.product?._id), idx)}
											disabled={loadingIdx === idx}
										>
											<Trash2 className="w-4 h-4" />
											{loadingIdx === idx ? "Đang xóa..." : "Xóa"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex justify-between items-center mt-6">
						<div>
							<button
								type="button"
								className="text-gray-600 hover:underline mr-4"
								onClick={() => setSelected(items.map((item: any, idx: number) => idx))}
							>
								Chọn tất cả
							</button>
							<button
								type="button"
								className="text-gray-600 hover:underline"
								onClick={async () => {
									for (const idx of selected) {
										await handleRemove(String(items[idx]?.product?._id), idx);
									}
									setSelected([]);
								}}
								disabled={selected.length === 0}
							>
								Xóa sản phẩm đã chọn
							</button>
						</div>
						<div className="text-lg font-bold">Tổng cộng: <span className="text-red-600">{total.toLocaleString()} đ</span></div>
						<a href="/checkout">
							<button type="button" className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-600">
								Đặt hàng
							</button>
						</a>
					</div>
				</form>
			)}
		</div>
	);
}


