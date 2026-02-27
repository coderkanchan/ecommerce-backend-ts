"use client";
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from "@/components/AdminRoute";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-[#111] p-6 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all shadow-2xl relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-bold mt-2 text-white">{value}</h2>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`}></div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [summary, setSummary] = useState({
    totalSales: 0,
    ordersCount: 0,
    usersCount: 0,
    salesData: [],
    recentOrders: []
  });

  useEffect(() => {
    setIsClient(true);
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const res = await fetch('http://localhost:5000/api/orders/summary', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    let interval: any;

    if (isLive) {
      interval = setInterval(() => {
        fetchSummary();
        console.log("Live Data Refreshed! ⚡");
      }, 30000);
    }

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">

          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            <button
              onClick={() => {
                setIsLive(!isLive);
                fetchSummary();
              }}
              className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium flex items-center gap-2 ${isLive
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></span>
              {isLive ? 'Live Updates Enabled' : 'Live Updates Paused'}
            </button>

          </div>
        
          {summary.lowStockCount > 0 && (
            <div className="mb-8 flex items-center justify-between bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <p className="text-red-500 text-sm font-bold tracking-wide uppercase">
                  Attention: {summary.lowStockCount} products are running low on stock!
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/products')}
                className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                RESTOCK NOW
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Total Revenue" value={`$${summary.totalSales.toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
            <StatCard title="Total Orders" value={summary.ordersCount} icon={ShoppingBag} color="bg-blue-500" />
            <StatCard title="Total Users" value={summary.usersCount} icon={Users} color="bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 bg-[#111] p-8 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                Sales Analytics <ArrowUpRight size={18} className="text-green-500" />
              </h2>
              <div style={{ width: '100%', height: 350 }}>
                {isClient && summary.salesData?.length > 0 ? (
                  <ResponsiveContainer>
                    <AreaChart data={summary.salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="_id" stroke="#444" fontSize={11} tickMargin={10} />
                      <YAxis stroke="#444" fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }} />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-700 italic">Loading Chart...</div>
                )}
              </div>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
              <div className="space-y-6">
                {summary.recentOrders && summary.recentOrders.length > 0 ? (
                  summary.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0">
                      <div>
                        <p className="font-medium text-sm">Order by {order.user?.name || 'Guest'}</p>

                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                      <p className="text-sm font-bold text-green-400">+${order.totalPrice.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic">No recent orders yet.</p>
                )}
              </div>

              <button
                onClick={() => router.push('/admin/orders')}
                className="w-full mt-8 py-4 rounded-2xl border border-gray-800 text-xs font-bold hover:bg-white hover:text-black transition-all tracking-widest"
              >
                VIEW ALL ORDERS
              </button>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}