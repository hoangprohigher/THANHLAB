import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function GET() {
  await connectMongo();
  const items = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, items });
}


