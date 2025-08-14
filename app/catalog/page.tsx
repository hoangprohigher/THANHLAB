export const dynamic = "force-dynamic";
import { AddToCartButton } from "@/components/cart-actions";
import { connectMongo } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";

export default async function CatalogPage() {
	await connectMongo();
	const categories = await Category.find().lean();
	const products = await Product.find().populate("category").lean();

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Danh mục sản phẩm</h1>
			<ul className="list-disc pl-5">
				{categories.map((c: any) => (
					<li key={String(c._id)}>{c.name}</li>
				))}
			</ul>
			<h2 className="text-lg font-semibold">Sản phẩm</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((p: any) => (
					<div key={String(p._id)} className="border rounded p-4">
						<div className="font-medium">{p.name}</div>
						<div className="text-sm text-muted-foreground">{p.category?.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">{p.price.toLocaleString()} đ</div>
                  <AddToCartButton productId={String(p._id)} />
                </div>
					</div>
				))}
			</div>
		</div>
	);
}


