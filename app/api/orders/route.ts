import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";

async function getDemoUser() {
	return User.findOne({ email: "customer@thanhlab.vn" });
}

export async function GET() {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const orders = await Order.find({ user: user._id }).populate("items.product").lean();
	return NextResponse.json({ ok: true, orders });
}

export async function POST(req: Request) {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const body = await req.json();
	const { name, email, address, items } = body;
	if (!items || !items.length) return NextResponse.json({ ok: false, error: "Chưa chọn sản phẩm" }, { status: 400 });
	const total = items.reduce((s: number, it: any) => s + it.price * it.quantity, 0);
	const order = await Order.create({ user: user._id, items, total, status: "pending", recipientName: name, recipientAddress: address });
	// Optionally: xóa các sản phẩm đã đặt khỏi giỏ hàng
	return NextResponse.json({ ok: true, orderId: order._id });
}


