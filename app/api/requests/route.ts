import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { RequestModel } from "@/lib/models/Request";
import { Service } from "@/lib/models/Service";

async function getDemoUser() {
	return User.findOne({ email: "customer@thanhlab.vn" });
}

export async function GET() {
	await connectMongo();
	const user = await getDemoUser();
	if (!user) return NextResponse.json({ ok: false }, { status: 400 });
	const items = await RequestModel.find({ user: user._id }).populate("service").lean();
	return NextResponse.json({ ok: true, requests: items });
}

export async function POST(req: NextRequest) {
	await connectMongo();
	const user = await getDemoUser();
	const { serviceId, content } = await req.json();
	if (!user || !serviceId || !content) return NextResponse.json({ ok: false }, { status: 400 });
	const service = await Service.findById(serviceId);
	if (!service) return NextResponse.json({ ok: false, error: "Service not found" }, { status: 404 });
	const created = await RequestModel.create({ user: user._id, service: service._id, content, status: "open" });
	return NextResponse.json({ ok: true, id: created._id });
}


