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

const deliverSellerOrderHandler = async (orderId: string) => {
  try {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/seller-deliver`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Your product items marked as delivered successfully! 🎉");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update status");
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
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
    fetchOrders();
  }, []);

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
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/2">
                  <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => item.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">{order.user?.name || "Guest"}</td>
                  <td className="px-6 py-4 text-blue-400">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-900/30 text-green-500' : 'bg-yellow-900/30 text-yellow-500'
                      }`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-24 text-center text-gray-500">
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