import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ProductSchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String },
		price: { type: Number, required: true },
		category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
		stock: { type: Number, default: 0 },
			images: {
				type: [String],
						 validate: [(arr: string[]) => arr.length <= 5, 'Tối đa 5 ảnh'],
				default: []
			},
	},
	{ timestamps: true }
	);

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);


