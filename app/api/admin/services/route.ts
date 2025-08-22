import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const items = await Service.find().lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { id, name, slug, description, price, images } = await req.json();
  if (!name || !slug || !price) return NextResponse.json({ ok: false }, { status: 400 });
  if (id) {
    await Service.updateOne({ _id: id }, {
      $set: {
        name,
        slug,
        description,
        price,
        images: Array.isArray(images) ? images : [],
      }
    });
    return NextResponse.json({ ok: true, id });
  } else {
    const created = await Service.create({ name, slug, description, price, images: Array.isArray(images) ? images : [] });
    return NextResponse.json({ ok: true, id: created._id });
  }

}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await Service.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}


