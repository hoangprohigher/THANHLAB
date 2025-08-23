import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function POST(req: Request) {
  await connectMongo();
  const { cart, form } = await req.json();
  // Đơn guest: không có userId
  const order = await Order.create({
    items: cart,
    customer: form,
    status: "guest",
    createdAt: new Date()
  });
  return NextResponse.json({ success: true, orderId: order._id });
}
