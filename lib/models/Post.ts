import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const PostSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		content: { type: String, required: true },
		tags: [{ type: String }],
	},
	{ timestamps: true }
);

export type PostDocument = InferSchemaType<typeof PostSchema> & { _id: mongoose.Types.ObjectId };

export const Post: Model<PostDocument> = mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);


