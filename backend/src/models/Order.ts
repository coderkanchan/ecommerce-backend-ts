
import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    user: Types.ObjectId;
    orderItems: {
        name: string;
        qty: number;
        imageUrl: string;
        price: number;
        product: Types.ObjectId;
        seller: Types.ObjectId;
        isDelivered?: boolean;
        deliveredAt?: Date;
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
    isDelivered: boolean;
    deliveredAt?: Date;
}

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            imageUrl: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
            seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
            isDelivered: { type: Boolean, default: false }, 
            deliveredAt: { type: Date }
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
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);
