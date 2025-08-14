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

  async function addService() {
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, price: Number(price) }),
    });
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <Input
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Giá (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
                <div>
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.slug}</div>
                  <div className="text-xs text-gray-400">{service.description}</div>
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
                  onClick={() => removeService(String(service._id))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


