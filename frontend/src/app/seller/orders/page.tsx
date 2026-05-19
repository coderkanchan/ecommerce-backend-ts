"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import { ShoppingBag, Loader2, CheckCircle, Package } from 'lucide-react';

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
      await fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update delivery status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-900 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Sales <span className="text-blue-500">Orders</span></h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Audit customer fulfillment loops and dispatch tracks</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
      ) : (
        <div className="bg-[#060606] border border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto min-w-full inline-block align-middle">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#0a0a0a] text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-900">
                <tr>
                  <th className="px-6 py-4">Reference ID</th>
                  <th className="px-6 py-4">Product Nodes</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status Token</th>
                  <th className="px-6 py-4 text-right">Actions Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900 text-sm text-gray-300">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const safeId = order._id ? String(order._id).toUpperCase() : '';
                    const displayId = safeId.length > 6 ? safeId.slice(-6) : safeId;

                    return (
                      <tr key={order._id} className="hover:bg-white/[0.01] transition-colors duration-200">
                        <td className="px-6 py-4 font-mono text-xs text-blue-400 font-bold">
                          #{displayId} 
                        </td>
                        <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                          {order.orderItems.map((item) => item.name).join(", ")}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-medium">{order.user?.name || "Guest Account"}</td>
                        <td className="px-6 py-4 text-white font-mono font-bold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${order.isDelivered
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                            {order.isDelivered ? 'Dispatched' : 'Processing'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {order.isDelivered ? (
                            <div className="inline-flex items-center gap-1 text-xs text-gray-500 font-semibold italic">
                              <CheckCircle size={12} className="text-green-500" /> Complete
                            </div>
                          ) : (
                            <button
                              onClick={() => deliverSellerOrderHandler(order._id)}
                              disabled={actionLoading === order._id}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/40 text-white rounded-lg text-[11px] font-black tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                              {actionLoading === order._id ? 'Writing...' : 'Fulfill Asset'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <ShoppingBag size={36} className="mx-auto text-gray-800 mb-3" />
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">No customer accounts order bound logs</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}