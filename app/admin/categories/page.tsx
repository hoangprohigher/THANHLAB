"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCategoriesPage() {
	const { data, mutate } = useSWR("/api/admin/categories", fetcher);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");

	async function addCategory() {
		await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, description }) });
		setName(""); setSlug(""); setDescription("");
		mutate();
	}

	async function removeCategory(id: string) {
		await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
		mutate();
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Quản lý danh mục</h1>
			<div className="flex gap-2">
				<input className="border rounded px-2 py-1" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="border rounded px-2 py-1" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
				<input className="border rounded px-2 py-1" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
				<Button onClick={addCategory}>Thêm</Button>
			</div>
			<ul className="space-y-2">
				{(data?.items || []).map((c: any) => (
					<li key={String(c._id)} className="border rounded p-3 flex items-center justify-between">
						<div>
							<div className="font-medium">{c.name}</div>
							<div className="text-xs text-muted-foreground">{c.slug}</div>
						</div>
						<button className="text-red-600 text-sm underline" onClick={() => removeCategory(String(c._id))}>Xóa</button>
					</li>
				))}
			</ul>
		</div>
	);
}


