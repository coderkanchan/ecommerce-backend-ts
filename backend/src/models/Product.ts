import { Schema, model, Document, Types } from 'mongoose';

interface IReview {
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string; 
  stock: number;
  imageUrl: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  seller: Types.ObjectId;
}

const reviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  subCategory: { type: String, required: false, default: "" }, 
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  seller: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema);