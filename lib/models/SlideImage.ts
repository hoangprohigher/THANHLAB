import mongoose, { Schema, Document } from 'mongoose';

export interface ISlideImage extends Document {
  url: string;
  createdAt: Date;
}

const SlideImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SlideImage || mongoose.model<ISlideImage>('SlideImage', SlideImageSchema);
