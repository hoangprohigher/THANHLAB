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

export async function POST() {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const cart = await Cart.findOne({ user: user._id }).lean();
	if (!cart || !cart.items?.length) return NextResponse.json({ ok: false, error: "Cart empty" }, { status: 400 });
	const items = await Promise.all(
		cart.items.map(async (it: any) => {
			const prod = await Product.findById(it.product).lean();
			return { product: it.product, quantity: it.quantity, price: prod?.price || 0 };
		})
	);
	const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
	const order = await Order.create({ user: user._id, items, total, status: "paid" });
	await Cart.updateOne({ user: user._id }, { $set: { items: [] } });
	return NextResponse.json({ ok: true, orderId: order._id });
}


