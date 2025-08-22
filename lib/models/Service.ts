import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ServiceSchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String },
		price: { type: Number, required: true },
		images: [{ type: String }], // mảng URL ảnh
	},
	{ timestamps: true }
);

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & { _id: mongoose.Types.ObjectId };

export const Service: Model<ServiceDocument> =
	mongoose.models.Service || mongoose.model<ServiceDocument>("Service", ServiceSchema);


