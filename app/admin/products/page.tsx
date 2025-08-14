"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminProductsPage() {
	const { data, mutate } = useSWR("/api/admin/products", fetcher);
	const { data: categoriesData } = useSWR("/api/admin/categories", fetcher);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [price, setPrice] = useState(0);
	const [category, setCategory] = useState<string>("");

	useEffect(() => {
		if (!category && categoriesData?.items?.length) setCategory(String(categoriesData.items[0]._id));
	}, [categoriesData, category]);

	async function addProduct() {
		await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, price, category }) });
		setName(""); setSlug(""); setPrice(0);
		mutate();
	}

	async function removeProduct(id: string) {
		await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
		mutate();
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
			<div className="grid grid-cols-1 md:grid-cols-5 gap-2">
				<input className="border rounded px-2 py-1" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="border rounded px-2 py-1" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
				<input className="border rounded px-2 py-1" type="number" placeholder="Giá" value={Number(price)} onChange={(e) => setPrice(Number(e.target.value))} />
				<select className="border rounded px-2 py-1" value={category} onChange={(e) => setCategory(e.target.value)}>
					{(categoriesData?.items || []).map((c: any) => (
						<option key={String(c._id)} value={String(c._id)}>{c.name}</option>
					))}
				</select>
				<Button onClick={addProduct}>Thêm</Button>
			</div>
			<ul className="space-y-2">
				{(data?.items || []).map((p: any) => (
					<li key={String(p._id)} className="border rounded p-3 flex items-center justify-between">
						<div>
							<div className="font-medium">{p.name}</div>
							<div className="text-xs text-muted-foreground">{p.slug}</div>
						</div>
						<button className="text-red-600 text-sm underline" onClick={() => removeProduct(String(p._id))}>Xóa</button>
					</li>
				))}
			</ul>
		</div>
	);
}


