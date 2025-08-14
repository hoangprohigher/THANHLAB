import mongoose from "mongoose";

declare global {
	// eslint-disable-next-line no-var
	var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global.mongooseConn;

if (!cached) {
	cached = global.mongooseConn = { conn: null, promise: null };
}

export async function connectMongo(): Promise<typeof mongoose> {
	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error("Missing MONGODB_URI environment variable");
	}
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		cached.promise = mongoose.connect(uri, { dbName: "thanhlab" });
	}
	cached.conn = await cached.promise;
	return cached.conn;
}


