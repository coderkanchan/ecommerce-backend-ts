"use client"; 
import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/seller"); 
        setOrders(data);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-white text-center">Loading Orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">
        Sales Orders
      </h1>
      <p className="text-gray-400 mb-8">Manage and track your customer orders here.</p>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-semibold">
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
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    {order.orderItems.map((item: any) => item.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">{order.user?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-blue-400 font-semibold">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-900/30 text-green-500 border border-green-500/20' : 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/20'
                      }`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-24 text-center text-gray-500 italic">
                  No orders received yet. Once a customer buys your products, they will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}