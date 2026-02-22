import { Request, Response, Router } from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// Route: POST /api/payment/order
router.post('/order', async (req: Request, res: Response) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed", error });
  }
});

export default router;