"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Package, Edit, Trash2, Plus, DollarSign } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminProductsPage() {
  const { data, mutate } = useSWR("/api/admin/products", fetcher);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { data: categoriesData } = useSWR("/api/admin/categories", fetcher);

  async function addProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        slug, 
        description, 
        price: Number(price), 
        stock: Number(stock),
        category: categoryId 
      }),
    });
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    mutate();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} sản phẩm
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Thêm sản phẩm mới
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Tên sản phẩm"
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
          <Input
            placeholder="Số lượng tồn kho"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {(categoriesData?.items || []).map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4">
          <Button onClick={addProduct} disabled={!name || !slug || !price || !stock}>
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((product: any) => (
            <div key={String(product._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.slug}</div>
                  <div className="text-xs text-gray-400">{product.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-green-600 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {product.price?.toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-500">Tồn kho: {product.stock}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeProduct(String(product._id))}
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


