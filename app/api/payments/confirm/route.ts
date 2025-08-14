import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

// Mock confirm payment and mark order as paid
export async function POST(req: NextRequest) {
  await connectMongo();
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
  await Order.updateOne({ _id: orderId }, { $set: { status: "paid" } });
  return NextResponse.json({ ok: true });
}


