import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const CartSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
		items: [
			{
				product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				quantity: { type: Number, required: true, min: 1 },
			},
		],
	},
	{ timestamps: true }
);

export type CartDocument = InferSchemaType<typeof CartSchema> & { _id: mongoose.Types.ObjectId };

export const Cart: Model<CartDocument> = mongoose.models.Cart || mongoose.model<CartDocument>("Cart", CartSchema);


