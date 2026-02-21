"use client";
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from "@/components/AdminRoute";
import { useEffect, useState } from 'react';

const [summary, setSummary] = useState({ totalSales: 0, ordersCount: 0, usersCount: 0 });

const fetchSummary = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const res = await fetch('http://localhost:5000/api/orders/summary', {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  });
  const data = await res.json();
  setSummary(data);
};

useEffect(() => { fetchSummary(); }, []);

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">Total Sales</p>
              <h3 className="text-2xl font-bold text-green-400">{summary.totalSales.toFixed(2)}</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-blue-400">{summary.ordersCount}</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-purple-400">{summary.usersCount}</h3>
            </div>
          </div>

          <div className="mt-12 bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center">
            <p className="text-gray-500">Charts and Detailed Analytics will go here...</p>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}