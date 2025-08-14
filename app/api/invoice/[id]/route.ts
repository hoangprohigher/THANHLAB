import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import dayjs from "dayjs";
import { connectMongo } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await connectMongo();
  const order = await Order.findById(id).populate("items.product", Product).lean();
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  const margin = 50;
  let y = height - margin;
  const drawText = (text: string, x: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    y -= size + 6;
  };

  // Header
  drawText("THANHLAB - HÓA ĐƠN BÁN HÀNG", margin, 18);
  drawText(`Mã đơn: ${String(order._id)}`, margin, 12);
  drawText(`Ngày: ${dayjs(order.createdAt).format("YYYY-MM-DD HH:mm")}`, margin, 12);

  y -= 10;
  drawText("Sản phẩm", margin, 14);

  let total = 0;
  for (const item of (order.items as any)) {
    const name = item.product?.name || "Sản phẩm";
    const quantity = item.quantity;
    const price = item.price;
    const line = `${name} x${quantity} — ${price.toLocaleString()} đ`;
    drawText(line, margin, 12);
    total += price * quantity;
  }

  y -= 10;
  drawText(`Tổng cộng: ${total.toLocaleString()} đ`, margin, 14);

  const bytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${String(order._id).slice(-6)}.pdf`,
    },
  });
}


