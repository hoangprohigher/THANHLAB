import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import SlideImage from '@/lib/models/SlideImage';

export async function GET() {
  await connectMongo();
  const images = await SlideImage.find().sort({ createdAt: -1 });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  const image = await SlideImage.create({ url });
  return NextResponse.json(image);
}

export async function DELETE(req: NextRequest) {
  await connectMongo();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await SlideImage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
