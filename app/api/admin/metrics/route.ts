import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { RequestModel } from "@/lib/models/Request";

export async function GET() {
	await connectMongo();
	const [users, orders, products, requests] = await Promise.all([
		User.countDocuments(),
		Order.countDocuments(),
		Product.countDocuments(),
		RequestModel.countDocuments(),
	]);
	const revenueAgg = await Order.aggregate([
		{ $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, revenue: { $sum: "$total" } } },
		{ $sort: { _id: 1 } },
	]);
	return NextResponse.json({ ok: true, stats: { users, orders, products, requests }, revenue: revenueAgg });
}


