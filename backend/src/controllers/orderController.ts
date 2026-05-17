import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

export const addOrderItems = async (req: any, res: Response) => {
  try {
    const { orderItems, shippingAddress, totalPrice, paymentMethod } = req.body;
    console.log("Incoming Order Data:", JSON.stringify(req.body, null, 2));

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const preparedOrderItems = await Promise.all(
      orderItems.map(async (item: any) => {
        let sellerId = item.seller;

        if (!sellerId || sellerId === null) {
          console.log(`⚠️ Seller ID missing for product ${item.product}. Fetching from Database...`);
          const dbProduct = await Product.findById(item.product);
          if (dbProduct && dbProduct.seller) {
            sellerId = dbProduct.seller;
            console.log(`🎯 Successfully mapped seller ID: ${sellerId} to item: ${item.name}`);
          } else {
            console.log(`❌ No seller found in DB for product: ${item.name}`);
          }
        }

        return {
          name: item.name,
          qty: Number(item.qty),
          imageUrl: item.imageUrl || item.image || "/placeholder.png",
          price: Number(item.price) || 0,
          product: item.product,
          seller: sellerId,
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      orderItems: preparedOrderItems,
      shippingAddress,
      totalPrice: Number(totalPrice),
      paymentMethod,
      isPaid: false,
    });

    const createdOrder = await order.save();
    console.log("✅ Order Saved to DB with Resolved Sellers:", createdOrder._id);
    res.status(201).json(createdOrder);

  } catch (error: any) {
    console.error("❌ Mongoose Save Error:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

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

export const updateSellerOrderToDelivered = async (req: any, res: Response) => {
  try {
    const orderId = req.params.id;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const hasSellerItems = order.orderItems.some(
      (item: any) => item.seller && item.seller.toString() === sellerId.toString()
    );

    if (!hasSellerItems) {
      return res.status(403).json({ message: 'You are not authorized to update this order' });
    }

    order.orderItems.forEach((item: any) => {
      if (item.seller && item.seller.toString() === sellerId.toString()) {
        item.isDelivered = true;
        item.deliveredAt = new Date();
      }
    });

    const allItemsDelivered = order.orderItems.every((item: any) => item.isDelivered === true);
    if (allItemsDelivered) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    console.log(`📦 Seller (${sellerId}) marked their items as DELIVERED in Order: ${orderId}`);

    res.json(updatedOrder);
  } catch (error: any) {
    console.error("❌ Seller Order Delivery Update Error:", error);
    res.status(500).json({ message: error.message || 'Error updating seller order status' });
  }
};

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

export const getSellerSummary = async (req: any, res: Response) => {
  try {
    const sellerId = req.user._id;

    const productsCount = await Product.countDocuments({ seller: sellerId });

    const orders = await Order.find({ "orderItems.seller": sellerId });

    const ordersCount = orders.length;

    const totalSales = orders.reduce((acc, order) => {
      const sellerItems = order.orderItems.filter(
        (item: any) => item.seller.toString() === sellerId.toString()
      );
      const sellerTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
      return acc + sellerTotal;
    }, 0);

    const customersCount = [...new Set(orders.map((order) => order.user.toString()))].length;

    res.json({
      productsCount,
      ordersCount,
      totalSales,
      customersCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching seller stats" });
  }
};

export const getSellerOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({
      "orderItems.seller": req.user._id,
    }).populate('user', 'name email').sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Seller Orders Fetch Error:", error);
    res.status(500).json({ message: "Error fetching seller orders" });
  }
};

export const getSellerStats = async (req: any, res: any) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({
      'orderItems.seller': sellerId
    });
    let totalRevenue = 0;
    const customerIds = new Set();
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        const sellerItems = (order.orderItems || []).filter(
          (item: any) => item.seller && item.seller.toString() === sellerId.toString()
        );
        const sellerOrderTotal = sellerItems.reduce(
          (acc: number, item: any) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0),
          0
        );
        totalRevenue += sellerOrderTotal;
        if (order.user) customerIds.add(order.user.toString());
      });
    }
    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders ? orders.length : 0,
      totalCustomers: customerIds.size,
      conversionRate: (orders && orders.length > 0) ? "5.2%" : "0%",
    });
  } catch (error) {
    console.error("Seller Stats Error:", error);
    res.status(500).json({ message: "Error fetching seller analytics" });
  }
};