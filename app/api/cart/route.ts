import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";
import { Cart } from "@/lib/models/Cart";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 400 });
	const cart = await Cart.findOne({ user: user._id }).populate({ path: "items.product", model: Product }).lean();
	return NextResponse.json({ ok: true, cart: cart || { items: [] } });
}

export async function POST(req: NextRequest) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 400 });
	const body = await req.json();
	const { productId, quantity } = body || {};
	if (!productId || !quantity) return NextResponse.json({ ok: false, error: "Missing productId/quantity" }, { status: 400 });
	const product = await Product.findById(productId);
	if (!product) return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
	let cart = await Cart.findOne({ user: user._id });
	if (!cart) {
		cart = await Cart.create({ user: user._id, items: [{ product: product._id, quantity }] });
	} else {
		const item = cart.items.find((it: any) => String(it.product) === String(product._id));
		if (item) {
			item.quantity += quantity;
		} else {
			cart.items.push({ product: product._id, quantity });
		}
		await cart.save();
	}
	return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	const { productId, quantity } = await req.json();
	if (!user || !productId || !quantity) return NextResponse.json({ ok: false }, { status: 400 });
	await Cart.updateOne({ user: user._id, "items.product": productId }, { $set: { "items.$.quantity": quantity } });
	return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
	await connectMongo();
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	const user = await User.findOne({ email: session.user.email });
	const { searchParams } = new URL(req.url);
	const productId = searchParams.get("productId");
	if (!user || !productId) return NextResponse.json({ ok: false }, { status: 400 });
	await Cart.updateOne(
		{ user: user._id },
		{ $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } }
	);
	return NextResponse.json({ ok: true });
}


