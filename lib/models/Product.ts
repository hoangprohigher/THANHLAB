import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ProductSchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String },
		price: { type: Number, required: true },
		category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
		stock: { type: Number, default: 0 },
		images: [{ type: String }],
	},
	{ timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };

export const Product: Model<ProductDocument> =
	mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);


