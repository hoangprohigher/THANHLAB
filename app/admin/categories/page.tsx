"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Edit, Trash2, Plus } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCategoriesPage() {
  const { data, mutate } = useSWR("/api/admin/categories", fetcher);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  async function addCategory() {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description }),
    });
    setName("");
    setSlug("");
    setDescription("");
    mutate();
  }

  async function removeCategory(id: string) {
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} danh mục
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Thêm danh mục mới
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={addCategory} disabled={!name || !slug}>
            Thêm
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách danh mục</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((category: any) => (
            <div key={String(category._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Folder className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">{category.slug}</div>
                  <div className="text-xs text-gray-400">{category.description}</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeCategory(String(category._id))}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


