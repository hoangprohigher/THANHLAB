import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, email, password } = body || {};
		if (!name || !email || !password) {
			return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
		}
		await connectMongo();
		const exists = await User.findOne({ email });
		if (exists) return NextResponse.json({ ok: false, error: "Email already exists" }, { status: 400 });
		const passwordHash = await hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role: "customer" });
		return NextResponse.json({ ok: true, id: user._id });
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
	}
}


