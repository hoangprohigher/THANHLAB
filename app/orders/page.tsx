import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";

export default async function OrdersPage() {
	await connectMongo();
	const user = await User.findOne({ email: "customer@thanhlab.vn" });
	const orders = user ? await Order.find({ user: user._id }).lean() : [];
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Đơn hàng</h1>
			{!orders.length ? (
				<p>Chưa có đơn hàng.</p>
			) : (
				<ul className="space-y-3">
					{orders.map((o: any) => (
						<li key={String(o._id)} className="border rounded p-4 flex items-center justify-between">
							<div>
								<div className="font-medium">#{String(o._id).slice(-6)}</div>
								<div className="text-sm text-muted-foreground">{o.items.length} sản phẩm</div>
							</div>
							<div className="font-semibold">{o.total.toLocaleString()} đ</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


