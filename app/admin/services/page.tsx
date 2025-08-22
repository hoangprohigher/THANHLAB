"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Edit, Trash2, Plus, DollarSign } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminServicesPage() {
  const { data, mutate } = useSWR("/api/admin/services", fetcher);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<any>({ images: "" });

  async function addService() {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        description,
        price: Number(price),
        images: images.split(/\r?\n/).map(u => u.trim()).filter(u => u),
      }),
    });
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setImages("");
    mutate();
  }

  async function editService() {
    if (!editId) return;
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId,
        name: editData.name,
        slug: editData.slug,
        description: editData.description,
        price: Number(editData.price),
        images: editData.images.split(/\r?\n/).map((u: string) => u.trim()).filter((u: string) => u),
      }),
    });
    setEditId(null);
    setEditData({ images: "" });
    mutate();
  }

  async function removeService(id: string) {
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý dịch vụ hỗ trợ</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} dịch vụ
        </div>
      </div>

      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Thêm dịch vụ mới
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Tên dịch vụ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <textarea
            placeholder="Mô tả (nhiều dòng)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <Input
            placeholder="Giá (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            placeholder="URL ảnh (mỗi dòng một ảnh)"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <Button onClick={addService} disabled={!name || !slug || !price}>
            Thêm dịch vụ
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách dịch vụ</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((service: any) => (
            <div key={String(service._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                {service.images && Array.isArray(service.images) && service.images.length > 0 && (
                  <div className="flex gap-2">
                    {service.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="service" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.slug}</div>
                  <div className="text-xs text-gray-400 whitespace-pre-line">{service.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-green-600 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {service.price?.toLocaleString()} đ
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditId(String(service._id));
                    setEditData({
                      name: service.name,
                      slug: service.slug,
                      description: service.description,
                      price: service.price,
                      images: Array.isArray(service.images) ? service.images.join("\n") : "",
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeService(String(service._id))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
      {/* Edit Service Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa dịch vụ</h3>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <Input
                placeholder="Tên dịch vụ"
                value={editData.name}
                onChange={e => setEditData((d: any) => ({ ...d, name: e.target.value }))}
              />
              <Input
                placeholder="Slug"
                value={editData.slug}
                onChange={e => setEditData((d: any) => ({ ...d, slug: e.target.value }))}
              />
              <textarea
                placeholder="Mô tả (nhiều dòng)"
                value={editData.description}
                onChange={e => setEditData((d: any) => ({ ...d, description: e.target.value }))}
                className="border rounded px-3 py-2"
              />
              <Input
                placeholder="Giá (VNĐ)"
                type="number"
                value={editData.price}
                onChange={e => setEditData((d: any) => ({ ...d, price: e.target.value }))}
              />
              <textarea
                placeholder="URL ảnh (mỗi dòng một ảnh)"
                value={editData.images}
                onChange={e => setEditData((d: any) => ({ ...d, images: e.target.value }))}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditId(null)}>Hủy</Button>
              <Button onClick={editService}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}


