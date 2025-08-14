import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ["admin", "customer"], default: "customer" },
	},
	{ timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserDocument> =
	mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);


