import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  isAdmin: boolean;
  role: 'buyer' | 'seller' | 'admin';
  storeDetails: {
    storeName: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    gstin: string;
  };
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profileImage: { type: String, required: false },
  isAdmin: { type: Boolean, required: true, default: false },
  role: {
    type: String,
    required: true,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  storeDetails: {
    storeName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    gstin: { type: String, default: '' }
  }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw new Error(error);
  }
});

export const User = model<IUser>('User', userSchema);