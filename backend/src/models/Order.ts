
import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    user: Types.ObjectId;
    orderItems: {
        name: string;
        qty: number;
        image: string;
        price: number;
        product: Types.ObjectId;
    }[];
    shippingAddress: {
        address: string;
        city: string;
        pincode: string;
    };
    paymentResult?: { 
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
}

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);