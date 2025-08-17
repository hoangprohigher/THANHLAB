"use client";
import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminSlidesPage() {
  const { data: slideImages, mutate } = useSWR("/api/slide-images", fetcher);
  const [urls, setUrls] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleAddImages(e: React.FormEvent) {
    e.preventDefault();
    const urlList = urls.split(/\r?\n/).map(u => u.trim()).filter(u => u);
    if (urlList.length === 0) return;
    setLoading(true);
    await Promise.all(urlList.map(url => fetch("/api/slide-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })));
    setUrls("");
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

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Quản lý ảnh slideshow trang chính</h2>
      <form className="mb-6" onSubmit={handleAddImages}>
        <label className="block mb-2 font-medium">Nhập nhiều URL ảnh (mỗi dòng một URL):</label>
        <textarea
          className="border rounded px-3 py-2 w-full h-24 mb-2"
          placeholder="https://...\nhttps://..."
          value={urls}
          onChange={e => setUrls(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Thêm ảnh
        </button>
      </form>
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
  );
}
