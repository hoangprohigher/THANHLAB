export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product-gallery";
import { connectMongo } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { AddToCartButton } from "@/components/cart-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectMongo();
  const product = await Product.findOne({ slug }).lean() as any;

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/catalog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        ← Quay lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          {/* Gallery nhiều ảnh, chọn ảnh, zoom */}
          <ProductGallery images={product.images || []} />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-gray-600 mb-2">{product.description}</div>
          <div className="text-lg font-semibold text-green-600 mb-4">{product.price.toLocaleString()} đ</div>
          <div className="mb-4">Tồn kho: {product.stock}</div>
          <div className="flex gap-4">
            {/* Nút thêm vào giỏ hàng dùng client component */}
            <AddToCartButton productId={product._id} />
            <form action="/checkout" method="POST">
              <input type="hidden" name="productId" value={product._id} />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Mua ngay</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
