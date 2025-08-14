import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";

export async function GET() {
  await connectMongo();
  const items = await Service.find().lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const { name, slug, description, price } = await req.json();
  if (!name || !slug || !price) return NextResponse.json({ ok: false }, { status: 400 });
  const created = await Service.create({ name, slug, description, price });
  return NextResponse.json({ ok: true, id: created._id });
}

export async function DELETE(req: NextRequest) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await Service.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}


