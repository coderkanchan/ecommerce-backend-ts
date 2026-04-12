"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DollarSign, Package, ShoppingBag, PlusCircle } from 'lucide-react';
import Link from 'next/link';

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
  </div>
);

export default function SellerDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && (!userInfo || userInfo.role !== 'seller')) {
      router.push('/'); 
    }
  }, [userInfo, router, isMounted]);

  if (!isMounted || !userInfo) return null;

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