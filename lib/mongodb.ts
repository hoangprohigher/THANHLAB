import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
	// Extend the Node global object with a mongoose cache to persist across hot reloads
	// eslint-disable-next-line no-var
	var mongooseConn: MongooseCache | undefined;
}

const globalForMongoose = global as unknown as { mongooseConn?: MongooseCache };
const cached: MongooseCache = (globalForMongoose.mongooseConn ||= { conn: null, promise: null });

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


