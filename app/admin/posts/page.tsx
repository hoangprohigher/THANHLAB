"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPostsPage() {
  const { data, mutate } = useSWR("/api/admin/posts", fetcher);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  async function addPost() {
    await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slug, content }) });
    setTitle(""); setSlug(""); setContent("");
    mutate();
  }

  async function removePost(id: string) {
    await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý bài viết</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded px-2 py-1" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={addPost}>Thêm</Button>
      </div>
      <ul className="space-y-2">
        {(data?.items || []).map((p: any) => (
          <li key={String(p._id)} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.slug}</div>
            </div>
            <button className="text-red-600 text-sm underline" onClick={() => removePost(String(p._id))}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


