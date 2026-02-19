"use client";
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const res = await fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await res.json();
    setProducts(data); 
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-sm font-semibold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Delivered</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4 text-xs font-mono text-blue-400">{order._id.substring(0, 10)}...</td>
                    <td className="p-4">{order.user && order.user.name}</td>
                    <td className="p-4">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-4 font-bold text-green-400">${order.totalPrice}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="text-green-400">✅ {order.paidAt.substring(0, 10)}</span>
                      ) : (
                        <span className="text-red-400">❌ No</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="text-green-400">✅ Delivered</span>
                      ) : (
                        <span className="text-yellow-400">⏳ Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}