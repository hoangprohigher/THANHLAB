import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const items = await Post.find().lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { title, slug, content } = await req.json();
  if (!title || !slug || !content) return NextResponse.json({ ok: false }, { status: 400 });
  const admin = await User.findOne({ role: "admin" }).lean();
  const created = await Post.create({ user: admin?._id, title, slug, content, tags: [] });
  return NextResponse.json({ ok: true, id: created._id });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await Post.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}


