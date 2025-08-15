"use client";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart-actions";

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow group overflow-hidden border hover:border-orange-500 transition relative cursor-pointer">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Ảnh sản phẩm */}
        <div className="bg-gray-100 h-36 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="object-contain h-32 w-full group-hover:scale-105 transition" />
          ) : (
            <div className="text-gray-400 text-xs">Không có ảnh</div>
          )}
        </div>
        {/* Tên, danh mục, giá */}
        <div className="p-3 flex flex-col gap-1">
          <div className="font-semibold text-base text-gray-900 truncate" title={product.name}>{product.name}</div>
          <div className="text-xs text-gray-500 truncate">{product.category?.name}</div>
          <div className="font-bold text-orange-600 text-lg">{product.price.toLocaleString()} đ</div>
        </div>
      </Link>
      {/* Nút mua/giỏ hàng */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition z-10">
        <AddToCartButton productId={String(product._id)} />
      </div>
      {/* Badge tồn kho */}
      <div className="absolute bottom-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition">Tồn kho: {product.stock}</div>
    </div>
  );
}
