"use client";
import useSWR from "swr";
import { useState } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Package, Edit, Trash2, Plus, DollarSign } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminProductsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, mutate } = useSWR("/api/admin/products", fetcher);
  const [name, setName] = useState("");
    const [editProduct, setEditProduct] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    function openEdit(product: any) {
      setEditProduct(product);
      setEditForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        detail: product.detail || "",
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    }
    function closeEdit() {
      setEditProduct(null);
      setEditForm({});
    }
    async function saveEdit() {
      await fetch(`/api/admin/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProduct._id,
          name: editForm.name,
          slug: editForm.slug,
          description: editForm.description,
          detail: editForm.detail,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          category: editForm.category,
          images: editProduct.images,
        }),
      });
      mutate();
      closeEdit();
    }
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Xóa ảnh đã chọn
  function removeImage(idx: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== idx);
    const newImages = images.filter((_, i) => i !== idx);
    setSelectedFiles(newFiles);
    setImages(newImages);
  }
  const { data: categoriesData } = useSWR("/api/admin/categories", fetcher);

  async function addProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        description,
        detail,
        price: Number(price),
        stock: Number(stock),
        category: categoryId,
        images,
      }),
    });
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setImages([]);
    setSelectedFiles([]);
    mutate();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      {/* Modal chỉnh sửa sản phẩm */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeEdit}
              title="Đóng"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa sản phẩm</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <Input
                  placeholder="Tên sản phẩm"
                  value={editForm.name}
                  onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  placeholder="Slug"
                  value={editForm.slug}
                  onChange={e => setEditForm((f: any) => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <Input
                  placeholder="Mô tả"
                  value={editForm.description}
                  onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))}
                />
                <textarea
                  placeholder="Mô tả chi tiết (dài, nhiều dòng)"
                  className="w-full border rounded p-2 mt-2"
                  rows={6}
                  value={editForm.detail}
                  onChange={e => setEditForm((f: any) => ({ ...f, detail: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                <Input
                  placeholder="Giá (VNĐ)"
                  type="number"
                  value={editForm.price}
                  onChange={e => setEditForm((f: any) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số lượng tồn kho</label>
                <Input
                  placeholder="Số lượng tồn kho"
                  type="number"
                  value={editForm.stock}
                  onChange={e => setEditForm((f: any) => ({ ...f, stock: e.target.value }))}
                />
              </div>
              <div>
                <div className="mb-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {(editProduct.images || []).map((img: string, idx: number) => (
                    <div key={idx} className="relative group rounded border overflow-hidden shadow-sm">
                      <img src={img} alt={`Ảnh ${idx+1}`}
                        className="w-full h-16 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = editProduct.images.filter((_: any, i: number) => i !== idx);
                          setEditProduct({ ...editProduct, images: newImages });
                        }}
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 shadow hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!editProduct.images || editProduct.images.length === 0) && (
                    <div className="col-span-5 text-gray-400 text-sm italic">Chưa có ảnh nào</div>
                  )}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="edit-image-upload"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    Promise.all(files.map(file => {
                      return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      });
                    })).then(imgs => {
                      setEditProduct({
                        ...editProduct,
                        images: [...(editProduct.images || []), ...imgs].slice(0, 5)
                      });
                    });
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none mt-1"
                  onClick={() => document.getElementById('edit-image-upload')?.click()}
                >
                  Thêm ảnh mới
                </button>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={closeEdit}>Hủy</Button>
                <Button onClick={saveEdit}>Lưu thay đổi</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Các phần tử JSX tiếp theo nằm ngoài modal */}
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
          <textarea
            placeholder="Mô tả chi tiết (dài, nhiều dòng)"
            className="w-full border rounded p-2 mt-2"
            rows={6}
            value={detail}
            onChange={e => setDetail(e.target.value)}
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
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-2">Hình ảnh sản phẩm (tối đa 5)</label>
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  // Cộng dồn file mới vào file cũ
                  const newFiles = [...selectedFiles, ...files].slice(0, 5);
                  Promise.all(newFiles.map(file => {
                    return new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                  })).then(imgs => {
                    setSelectedFiles(newFiles);
                    setImages(imgs);
                  });
                }}
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn ảnh sản phẩm
              </button>
              {/* Preview ảnh đã chọn */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                {images.length > 0 ? images.map((img, idx) => (
                  <div key={idx} className="relative group rounded border overflow-hidden shadow-sm">
                    <img src={img} alt={selectedFiles[idx]?.name || `Ảnh ${idx+1}`}
                      className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 shadow hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-black/40 text-xs text-white px-1 py-0.5 truncate">{selectedFiles[idx]?.name}</div>
                  </div>
                )) : (
                  <div className="col-span-5 text-gray-400 text-sm italic">Chưa chọn ảnh nào</div>
                )}
              </div>
            </div>
          </div>
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
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => openEdit(product)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
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


