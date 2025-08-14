import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
	// Protect admin API
	if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const items = await Category.find().lean();
	return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
	if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const { name, slug, description } = await req.json();
	if (!name || !slug) return NextResponse.json({ ok: false, error: "Missing name/slug" }, { status: 400 });
	const created = await Category.create({ name, slug, description });
	return NextResponse.json({ ok: true, id: created._id });
}

export async function PUT(req: NextRequest) {
	if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const { id, name, slug, description } = await req.json();
	if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
	await Category.updateOne({ _id: id }, { $set: { name, slug, description } });
	return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
	if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
	await connectMongo();
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
	await Category.deleteOne({ _id: id });
	return NextResponse.json({ ok: true });
}


