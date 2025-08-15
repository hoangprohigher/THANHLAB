import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
	if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const items = await Product.find().lean();
	return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
	if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const { name, slug, price, category, description, stock } = await req.json();
	if (!name || !slug || !price || !category) return NextResponse.json({ ok: false }, { status: 400 });
	const created = await Product.create({ name, slug, price, category, description, stock });
	return NextResponse.json({ ok: true, id: created._id });
}

export async function DELETE(req: NextRequest) {
	if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	if (!id) return NextResponse.json({ ok: false }, { status: 400 });
	await Product.deleteOne({ _id: id });
	return NextResponse.json({ ok: true });
}


