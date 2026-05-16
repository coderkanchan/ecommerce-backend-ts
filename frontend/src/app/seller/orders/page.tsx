"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  image: string;
  product: string;
  seller: string;
  isDelivered?: boolean; 
}

interface Order {
  _id: string;
  user: { name: string };
  orderItems: OrderItem[];
  totalPrice: number;
  isDelivered: boolean;
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/seller");
      setOrders(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverSellerOrderHandler = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to mark this item as delivered?")) return;

    try {
      setActionLoading(orderId);
      await API.put(`/orders/${orderId}/seller-deliver`);

      alert("Your product items marked as delivered successfully! 🎉");

      await fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update delivery status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-10 text-white text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">
        Sales Orders
      </h1>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Global Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => item.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.user?.name || "Guest"}</td>
                  <td className="px-6 py-4 text-blue-400 font-semibold">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                      {order.isDelivered ? 'All Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.isDelivered ? (
                      <span className="text-xs text-gray-500 italic">Dispatched</span>
                    ) : (
                      <button
                        onClick={() => deliverSellerOrderHandler(order._id)}
                        disabled={actionLoading === order._id}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white rounded-lg text-xs font-medium tracking-wider uppercase transition-all"
                      >
                        {actionLoading === order._id ? 'Updating...' : 'Mark Delivered'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-24 text-center text-gray-500">
                  No orders received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}