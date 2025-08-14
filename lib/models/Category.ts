import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const CategorySchema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String },
	},
	{ timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema> & { _id: mongoose.Types.ObjectId };

export const Category: Model<CategoryDocument> =
	mongoose.models.Category || mongoose.model<CategoryDocument>("Category", CategorySchema);


