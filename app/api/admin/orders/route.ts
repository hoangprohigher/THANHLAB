import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { isAdminRequest } from "@/lib/admin-guard";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const items = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}


