import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";

export async function GET() {
	try {
		await connectMongo();
		return NextResponse.json({ ok: true, service: "thanhlab", db: "connected" });
	} catch (error) {
		return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
	}
}


