import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const RequestSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
		content: { type: String, required: true },
		status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
		adminReply: { type: String },
	},
	{ timestamps: true }
);

export type RequestDocument = InferSchemaType<typeof RequestSchema> & { _id: mongoose.Types.ObjectId };

export const RequestModel: Model<RequestDocument> =
	mongoose.models.Request || mongoose.model<RequestDocument>("Request", RequestSchema);


