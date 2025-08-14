import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { Service } from "@/lib/models/Service";
import { RequestModel } from "@/lib/models/Request";
import { Post } from "@/lib/models/Post";

export async function GET() {
	await connectMongo();

	// Insert test docs
	const user = await User.create({ name: "Test User", email: `user_${Date.now()}@example.com`, passwordHash: "x", role: "customer" });
	const admin = await User.create({ name: "Admin", email: `admin_${Date.now()}@example.com`, passwordHash: "x", role: "admin" });
	const cat = await Category.create({ name: "Robot", slug: `robot-${Date.now()}`, description: "Category test" });
	const prod = await Product.create({ name: "Robot A", slug: `robot-a-${Date.now()}`, description: "Prod test", price: 1000000, category: cat._id, stock: 5 });
	const order = await Order.create({ user: user._id, items: [{ product: prod._id, quantity: 1, price: prod.price }], total: prod.price, status: "pending" });
	const service = await Service.create({ name: "Tư vấn đồ án", slug: `tu-van-${Date.now()}`, description: "Service test", price: 200000 });
	const request = await RequestModel.create({ user: user._id, service: service._id, content: "Cần hỗ trợ", status: "open" });
	const post = await Post.create({ user: admin._id, title: "Bài viết kỹ thuật", slug: `bai-viet-${Date.now()}`, content: "Nội dung...", tags: ["robot"] });

	// Cleanup
	await Promise.all([
		Order.deleteOne({ _id: order._id }),
		Product.deleteOne({ _id: prod._id }),
		Category.deleteOne({ _id: cat._id }),
		RequestModel.deleteOne({ _id: request._id }),
		Service.deleteOne({ _id: service._id }),
		Post.deleteOne({ _id: post._id }),
		User.deleteOne({ _id: user._id }),
		User.deleteOne({ _id: admin._id }),
	]);

	return NextResponse.json({ ok: true, message: "DB test passed", ids: { user: user._id, cat: cat._id, prod: prod._id, order: order._id, service: service._id, request: request._id, post: post._id } });
}


