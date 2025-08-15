export const dynamic = "force-dynamic";
import { AddToCartButton } from "@/components/cart-actions";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";

export default async function CatalogPage() {
	await connectMongo();
	const categories = await Category.find().lean();
	const products = await Product.find().populate("category").lean();

	return (
	  <div className="flex flex-col md:flex-row gap-6">
	    {/* Sidebar filter */}
	    <aside className="md:w-64 w-full bg-white rounded-lg shadow p-4 mb-4 md:mb-0">
	      <h2 className="text-lg font-semibold mb-2">Bộ lọc tìm kiếm</h2>
	      <div className="space-y-3">
	        <div>
	          <div className="font-medium text-sm mb-1">Theo Danh Mục</div>
	          <ul className="space-y-1">
	            {categories.map((c: any) => (
	              <li key={String(c._id)}>
	                <label className="flex items-center gap-2 cursor-pointer">
	                  <input type="checkbox" className="accent-blue-500" disabled />
	                  <span>{c.name}</span>
	                </label>
	              </li>
	            ))}
	          </ul>
	        </div>
	        {/* Có thể thêm filter giá, thương hiệu, ... */}
	      </div>
	    </aside>

	    {/* Main product grid */}
	    <main className="flex-1">
	      <div className="flex items-center justify-between mb-4">
	        <h1 className="text-xl font-bold text-orange-600">Sản phẩm</h1>
	        <div className="flex gap-2">
	          <button className="px-3 py-1 rounded bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200">Liên Quan</button>
	          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Mới Nhất</button>
	          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Bán Chạy</button>
	          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Giá</button>
	        </div>
	      </div>
	      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
							{products.map((p: any) => (
								<ProductCard key={String(p._id)} product={p} />
							))}
	      </div>
	    </main>
	  </div>
	);
}


