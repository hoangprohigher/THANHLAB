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
	const primaryUri = process.env.MONGODB_URI;
	const devFallbackUri = "mongodb://localhost:27017/thanhlab";
	if (!primaryUri) {
		throw new Error("Missing MONGODB_URI environment variable");
	}
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(primaryUri, { dbName: "thanhlab" })
			.catch(async (err) => {
				if (process.env.NODE_ENV !== "production") {
					console.warn(
						`Primary MongoDB connection failed: ${err?.message}. Trying localhost fallback...`
					);
					return mongoose.connect(devFallbackUri, { dbName: "thanhlab" });
				}
				throw err;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}


