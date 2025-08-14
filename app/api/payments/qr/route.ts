import { NextRequest, NextResponse } from "next/server";
import * as QRCode from "qrcode";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";

// Create a mock order and return QR code payload and PNG
export async function POST(req: NextRequest) {
  await connectMongo();
  const customer = await User.findOne({ email: "customer@thanhlab.vn" });
  const { amount } = await req.json();
  const total = Number(amount) || 100000;
  const order = await Order.create({ user: customer?._id, items: [], total, status: "pending" });

  const payload = `THANHLAB|ORDER=${String(order._id)}|AMOUNT=${total}`;
  const png = await QRCode.toDataURL(payload, { margin: 1, scale: 6 });

  return NextResponse.json({ ok: true, orderId: order._id, amount: total, payload, qrDataUrl: png });
}


