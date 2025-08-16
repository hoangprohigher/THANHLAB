export const dynamic = "force-dynamic";
import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function OrdersPage() {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		return <div className="space-y-6"><h1 className="text-xl font-semibold">Đơn hàng</h1><p>Bạn cần đăng nhập để xem đơn hàng.</p></div>;
	}
	const user = await User.findOne({ email: session.user.email });
	const orders = user ? await Order.find({ user: user._id }).populate('items.product').lean() : [];
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Đơn hàng</h1>
			{!orders.length ? (
				<p>Chưa có đơn hàng.</p>
			) : (
				<ul className="space-y-3">
					{orders.map((o: any) => (
						<li key={String(o._id)} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
							<div>
								<div className="font-medium">#{String(o._id).slice(-6)}</div>
								<div className="text-sm text-muted-foreground">{o.items.length} sản phẩm</div>
								<div className="text-xs text-gray-500 capitalize">Trạng thái: {o.status}</div>
								<div className="text-xs text-gray-500">Họ tên: {o.recipientName || '-'}</div>
								<div className="text-xs text-gray-500">Số điện thoại: {o.recipientPhone || '-'}</div>
								<div className="text-xs text-gray-500">Địa chỉ: {o.recipientAddress || '-'}</div>
								<div className="text-xs text-gray-500">Mã vận đơn: {o.trackingCode || '-'}</div>
								<div className="text-xs text-gray-500">Nhà vận chuyển: {o.shippingProvider || '-'}</div>
								<ul className="ml-4 list-disc">
									{o.items.map((item: any, idx: number) => {
										let productName = "Không rõ tên sản phẩm";
										if (item.product && typeof item.product === "object" && item.product.name) {
											productName = item.product.name;
										} else if (item.productName) {
											productName = item.productName;
										}
										return (
											<li key={idx}>
												{productName} x {item.quantity} - {item.price?.toLocaleString()} đ
											</li>
										);
									})}
								</ul>
								<div className="text-xs text-gray-500 mt-2">Ngày tạo: {new Date(o.createdAt).toLocaleDateString("vi-VN")}</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="font-semibold">{o.total.toLocaleString()} đ</div>
								<Link className="text-sm underline" href={`/api/invoice/${String(o._id)}`} target="_blank">Tải hóa đơn (PDF)</Link>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


