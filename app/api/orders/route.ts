import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: Request) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const orders = await Order.find({ user: user._id }).populate("items.product").lean();
	return NextResponse.json({ ok: true, orders });
}

export async function POST(req: Request) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const body = await req.json();
	const { name, email, address, phone, items } = body;
	if (!items || !items.length) return NextResponse.json({ ok: false, error: "Chưa chọn sản phẩm" }, { status: 400 });
	const total = items.reduce((s: number, it: any) => s + it.price * it.quantity, 0);
	const order = await Order.create({
		user: user._id,
		items,
		total,
		status: "pending",
		recipientName: name,
		recipientPhone: phone,
		recipientAddress: address,
		recipientEmail: email
	});
	return NextResponse.json({ ok: true, orderId: order._id });
}


