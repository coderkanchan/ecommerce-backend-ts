"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DollarSign, Package, ShoppingBag, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [summary, setSummary] = useState({ productsCount: 0, ordersCount: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller-summary`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.role === 'seller') fetchStats();
  }, [userInfo]);

  const stats = [
    { label: "Total Revenue", value: `₹${summary.totalSales}`, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Orders Received", value: summary.ordersCount, icon: ShoppingBag, color: "text-blue-500" },
    { label: "Active Products", value: summary.productsCount, icon: Package, color: "text-purple-500" },
    { label: "Total Customers", value: "0", icon: Users, color: "text-orange-500" },
  ];
  
  return (
    <div className="min-h-screen bg-black text-white flex">

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your store and products</p>
          </div>
          <Link href="/seller/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition">
            <PlusCircle size={20} /> Manage Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="My Sales" value={`$0.00`} icon={DollarSign} color="bg-green-500" />
          <StatCard title="My Products" value={`0`} icon={Package} color="bg-blue-500" />
          <StatCard title="Total Orders" value={`0`} icon={ShoppingBag} color="bg-purple-500" />
        </div>

        <div className="bg-[#111] border border-dashed border-gray-800 rounded-3xl p-20 text-center">
          <p className="text-gray-500">No recent activity. Start by adding a product!</p>
        </div>
      </main>
    </div>
  );
}