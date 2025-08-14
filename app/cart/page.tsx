export const dynamic = "force-dynamic";
import { connectMongo } from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";

export default async function CartPage() {
	await connectMongo();
	const user = await User.findOne({ email: "customer@thanhlab.vn" });
	const cart = user ? await Cart.findOne({ user: user._id }).populate({ path: "items.product", model: Product }).lean() : null;
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Giỏ hàng</h1>
			{!cart?.items?.length ? (
				<p>Chưa có sản phẩm.</p>
			) : (
				<ul className="space-y-3">
					{cart.items.map((it: any, idx: number) => (
						<li key={idx} className="border rounded p-4 flex justify-between">
							<div>
								<div className="font-medium">{it.product?.name}</div>
								<div className="text-sm text-muted-foreground">Số lượng: {it.quantity}</div>
							</div>
							<div className="font-semibold">{(it.product?.price || 0).toLocaleString()} đ</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


