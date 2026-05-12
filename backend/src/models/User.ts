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

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Is hisse ko dhyan se update karein
userSchema.pre('save', async function (next) {
  const user = this as any; // TypeScript bypass ke liye

  // Agar password modify nahi hua hai, toh aage badho
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next(); // Next ko yahan call karna zaroori hai
  } catch (error: any) {
    next(error);
  }
});
export const User = model<IUser>('User', userSchema);

