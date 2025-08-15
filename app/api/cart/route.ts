import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";
import { Cart } from "@/lib/models/Cart";
import mongoose from "mongoose";

async function getDemoUser() {
	const email = "customer@thanhlab.vn";
	return User.findOne({ email });
}

export async function GET() {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false, error: "Seed customer not found" }, { status: 400 });
	const cart = await Cart.findOne({ user: user._id }).populate({ path: "items.product", model: Product }).lean();
	return NextResponse.json({ ok: true, cart: cart || { items: [] } });
}

export async function POST(req: NextRequest) {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false, error: "Seed customer not found" }, { status: 400 });
	const body = await req.json();
	const { productId, quantity } = body || {};
	if (!productId || !quantity) return NextResponse.json({ ok: false, error: "Missing productId/quantity" }, { status: 400 });
	const product = await Product.findById(productId);
	if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
	let cart = await Cart.findOne({ user: user._id });
	if (!cart) {
		cart = await Cart.create({ user: user._id, items: [{ product: product._id, quantity }] });
		console.log("Cart created:", cart);
	} else {
		const item = cart.items.find((it: any) => String(it.product) === String(product._id));
		if (item) {
			item.quantity += quantity;
			console.log("Updated quantity for product", product._id, "new quantity:", item.quantity);
		} else {
			cart.items.push({ product: product._id, quantity });
			console.log("Added new product to cart:", product._id);
		}
		await cart.save();
		console.log("Cart after save:", cart);
	}
	return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
	await connectMongo();
	const user = await getDemoUser();
	const { productId, quantity } = await req.json();
	if (!user || !productId || !quantity) return NextResponse.json({ ok: false }, { status: 400 });
	await Cart.updateOne({ user: user._id, "items.product": productId }, { $set: { "items.$.quantity": quantity } });
	return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
	await connectMongo();
	const user = await getDemoUser();
	const { searchParams } = new URL(req.url);
	const productId = searchParams.get("productId");
	if (!user || !productId) return NextResponse.json({ ok: false }, { status: 400 });
	await Cart.updateOne(
		{ user: user._id },
		{ $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } }
	);
	return NextResponse.json({ ok: true });
}


