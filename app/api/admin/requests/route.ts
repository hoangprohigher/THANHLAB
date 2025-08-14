import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { RequestModel } from "@/lib/models/Request";

export async function GET() {
  await connectMongo();
  const items = await RequestModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}

export async function PUT(req: NextRequest) {
  await connectMongo();
  const { id, status, adminReply } = await req.json();
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await RequestModel.updateOne({ _id: id }, { $set: { status, adminReply } });
  return NextResponse.json({ ok: true });
}


