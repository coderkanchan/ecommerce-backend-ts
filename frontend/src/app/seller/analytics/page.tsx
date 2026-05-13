"use client";

import { TrendingUp, Users, ShoppingBag, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsPage = () => {
  const [statsData, setStatsData] = useState({
    totalRevenue: '0.00',
    totalOrders: '0',
    totalCustomers: '0',
    conversionRate: '0%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/orders/seller-stats');
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${statsData.totalRevenue}`,
      icon: <CreditCard className="text-green-500" />,
      change: '+0%'
    },
    {
      label: 'Total Orders',
      value: statsData.totalOrders,
      icon: <ShoppingBag className="text-blue-500" />,
      change: '+0%'
    },
    {
      label: 'Total Customers',
      value: statsData.totalCustomers,
      icon: <Users className="text-orange-500" />,
      change: '+0%'
    },
    {
      label: 'Conversion Rate',
      value: statsData.conversionRate,
      icon: <TrendingUp className="text-purple-500" />,
      change: '0%'
    },
  ];

  return (
    <div className="bg-black h-full text-white p-4">
      <h1 className="text-3xl font-bold mb-8 italic">
        STORE <span className="text-blue-600">ANALYTICS</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl transition-transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-900 rounded-lg">{stat.icon}</div>
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-500 italic">No sales data available yet to generate charts.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;