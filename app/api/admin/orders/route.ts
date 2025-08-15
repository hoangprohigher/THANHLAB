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



export async function PUT(req: Request) {
  if (!(await isAdminRequest(req as any))) return NextResponse.json({ ok: false }, { status: 401 });
  await connectMongo();
  const body = await req.json();
  const { id, status, trackingCode, shippingProvider } = body;
  if (!id || !status) return NextResponse.json({ ok: false, error: "Thiếu id hoặc status" }, { status: 400 });
  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ ok: false, error: "Không tìm thấy đơn hàng" }, { status: 404 });
  order.status = status;
  if (status === "shipping") {
    order.trackingCode = trackingCode || "";
    order.shippingProvider = shippingProvider || "";
  }
  await order.save();
  return NextResponse.json({ ok: true });
}


