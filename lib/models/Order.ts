import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const OrderSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		items: [
			{
				product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				quantity: { type: Number, required: true, min: 1 },
				price: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
		status: { type: String, enum: [
			"pending",         // Đơn mới
			"confirmed",       // Xác nhận đơn
			"waiting",         // Chờ gửi hàng
			"shipping",        // Đang giao
			"completed",       // Giao thành công
			"canceled"         // Đã hủy
		], default: "pending" },
		trackingCode: { type: String },
		shippingProvider: { type: String },
		recipientName: { type: String },
		recipientPhone: { type: String },
		recipientAddress: { type: String },
		recipientEmail: { type: String },
	},
	{ timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };

export const Order: Model<OrderDocument> =
	mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);


