"use client";
import { TrendingUp, Users, ShoppingBag, CreditCard, Loader2, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function AnalyticsPage() {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: '0%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller-stats`, config);
        setStatsData({
          totalRevenue: data?.totalRevenue || 0,
          totalOrders: data?.totalOrders || 0,
          totalCustomers: data?.totalCustomers || 0,
          conversionRate: data?.conversionRate || '0%'
        });
      } catch (err) {
        console.error("Failed to fetch analytics logs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchStats();
    }
  }, [userInfo]);

  const stats = [
    {
      label: 'Total Revenue String',
      value: `₹${Number(statsData.totalRevenue).toLocaleString('en-IN')}`,
      icon: <CreditCard size={16} className="text-blue-500" />,
      change: '+0%'
    },
    {
      label: 'Total Orders Volume',
      value: statsData.totalOrders,
      icon: <ShoppingBag size={16} className="text-blue-500" />,
      change: '+0%'
    },
    {
      label: 'Target Customers Count',
      value: statsData.totalCustomers,
      icon: <Users size={16} className="text-blue-500" />,
      change: '+0%'
    },
    {
      label: 'System Conversion Rate',
      value: statsData.conversionRate,
      icon: <TrendingUp size={16} className="text-blue-500" />,
      change: '0%'
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Structural Metric Headers */}
      <div className="border-b border-gray-900 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Store <span className="text-blue-500">Analytics</span></h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Monitor data conversion logs and macro-economic market grids</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#0a0a0a] p-5 rounded-2xl border border-gray-900 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-gray-900/60 border border-gray-800 rounded-lg shrink-0">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                {stat.change}
              </span>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">{stat.label}</label>
              <h3 className="text-xl font-black font-mono text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-900 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
          <BarChart3 className="text-gray-500 w-4 h-4" />
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Sales Overview Vector</h2>
        </div>

        <div className="h-64 flex flex-col items-center justify-center bg-black/40 border border-gray-950 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">No transactional vectors compiled</p>
          <p className="text-[10px] text-gray-700 uppercase tracking-widest mt-1">Charts will generate automatically upon real-time checkout bindings</p>
        </div>
      </div>
    </div>
  );
}