import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const items = await User.find().lean();
  return NextResponse.json({ ok: true, items });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { id, name, role } = await req.json();
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  await User.updateOne({ _id: id }, { $set: { name, role } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  await User.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}


