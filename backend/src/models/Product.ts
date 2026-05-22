import { Schema, model, Document, Types } from 'mongoose';

interface IReview {
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
}

// 1. Updated TypeScript Interface with subCategory ✨
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string; // Added to fix TypeScript strict compilation errors
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

// 2. Updated Mongoose Schema with subCategory ✨
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  subCategory: { type: String, required: false, default: "" }, // Explicit structural fallback
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