import { Request, Response } from 'express';
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Private (Aap chahein toh baad mein protect middleware add kar sakti hain)
export const createOrder = async (req: Request, res: Response) => {
  const { amount } = req.body;

  const options = {
    amount: Math.round(amount * 100), 
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error
    });
  }
};