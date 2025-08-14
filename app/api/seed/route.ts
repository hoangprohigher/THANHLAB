import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { Service } from "@/lib/models/Service";
import { Post } from "@/lib/models/Post";
import { hash } from "bcryptjs";

export async function POST() {
	await connectMongo();

	// Admin and customer
	const adminEmail = "admin@thanhlab.vn";
	const customerEmail = "customer@thanhlab.vn";
	const [admin, customer] = await Promise.all([
		User.findOneAndUpdate(
			{ email: adminEmail },
			{ name: "Admin", email: adminEmail, passwordHash: await hash("admin123", 10), role: "admin" },
			{ upsert: true, new: true }
		),
		User.findOneAndUpdate(
			{ email: customerEmail },
			{ name: "Khách hàng", email: customerEmail, passwordHash: await hash("customer123", 10), role: "customer" },
			{ upsert: true, new: true }
		),
	]);

	// Categories
	const cat1 = await Category.findOneAndUpdate(
		{ slug: "robot" },
		{ name: "Robot", slug: "robot", description: "Danh mục Robot" },
		{ upsert: true, new: true }
	);
	const cat2 = await Category.findOneAndUpdate(
		{ slug: "mach-dieu-khien" },
		{ name: "Mạch điều khiển", slug: "mach-dieu-khien", description: "Danh mục mạch" },
		{ upsert: true, new: true }
	);

	// Products (5)
	const productsPayload = [
		{ name: "Robot dò line", slug: "robot-do-line", description: "Robot tự dò line", price: 1500000, category: cat1._id, stock: 10 },
		{ name: "Robot tránh vật cản", slug: "robot-tranh-vat-can", description: "Cảm biến siêu âm", price: 1800000, category: cat1._id, stock: 8 },
		{ name: "Arduino Uno", slug: "arduino-uno", description: "Board điều khiển", price: 200000, category: cat2._id, stock: 50 },
		{ name: "ESP32", slug: "esp32", description: "WiFi/BLE", price: 250000, category: cat2._id, stock: 40 },
		{ name: "STM32F103C8T6", slug: "stm32-bluepill", description: "ARM Cortex-M3", price: 120000, category: cat2._id, stock: 30 },
	];
	for (const p of productsPayload) {
		await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
	}

	// Service
	await Service.findOneAndUpdate(
		{ slug: "tu-van-do-an" },
		{ name: "Tư vấn đồ án", slug: "tu-van-do-an", description: "Tư vấn, định hướng, review", price: 300000 },
		{ upsert: true, new: true }
	);

	// Post
	await Post.findOneAndUpdate(
		{ slug: "huong-dan-arduino-co-ban" },
		{ user: admin._id, title: "Hướng dẫn Arduino cơ bản", slug: "huong-dan-arduino-co-ban", content: "Bài viết kỹ thuật cơ bản", tags: ["arduino", "beginner"] },
		{ upsert: true, new: true }
	);

	return NextResponse.json({ ok: true, message: "Seeded" });
}


