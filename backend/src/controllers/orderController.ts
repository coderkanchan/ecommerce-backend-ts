import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const addOrderItems = async (req: any, res: Response) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

export const updateOrderToPaid = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.razorpay_payment_id,
      status: 'completed',
      update_time: String(Date.now()),
      email_address: req.body.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({
      totalOrders,
      totalSales,
      message: "Dashboard data fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

export const updateOrderToDelivered = async (req: any, res: any) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isDelivered: true,
        deliveredAt: new Date(),
      },
      { new: true }
    );

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
};

// export const getOrderSummary = async (req: any, res: any) => {

//   try {
//     const orders = await Order.find();
//     const ordersCount = orders.length;

//     const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);

//     const usersCount = await User.countDocuments();

//     const salesData = await Order.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           sales: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     const recentOrders = await Order.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name');

//     res.json({
//       ordersCount,
//       totalSales,
//       usersCount,
//       salesData,
//       recentOrders,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching summary", error });
//   }
// };

export const getOrderSummary = async (req: any, res: any) => {
  try {
    const orders = await Order.find();
    const ordersCount = orders.length;
    const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);
    const usersCount = await User.countDocuments();

    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.json({
      ordersCount,
      totalSales,
      usersCount,
      salesData,
      recentOrders,
      lowStockCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary", error });
  }
};