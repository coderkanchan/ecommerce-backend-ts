"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  DollarSign,
  Package,
  ShoppingBag,
  PlusCircle,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
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
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`}></div>
  </div>
);

export default function SellerDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [summary, setSummary] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0,
    customersCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller-summary`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error("Error fetching seller stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.role === 'seller') {
      fetchStats();
    } else {
      router.push('/');
    }
  }, [userInfo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">SELLER CENTRAL</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base tracking-tight font-medium">
            Welcome back, <span className="text-blue-400">{userInfo?.name}</span>. Here's your store snapshot.
          </p>
        </div>
        <Link
          href="/seller/add-product"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <PlusCircle size={20} /> ADD PRODUCT
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <StatCard title="Revenue" value={`₹${summary.totalSales.toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Orders" value={summary.ordersCount} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Products" value={summary.productsCount} icon={Package} color="bg-purple-500" />
        <StatCard title="Customers" value={summary.customersCount} icon={Users} color="bg-orange-500" />
      </div>

      {summary.productsCount === 0 ? (
        <div className="bg-[#050505] border-2 border-dashed border-gray-900 rounded-[2.5rem] p-10 md:p-20 text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-700">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-white tracking-tight">No Products Found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm md:text-base">
            Ready to scale? Add your first item to the NexusMart ecosystem.
          </p>
          <Link href="/seller/add-product" className="text-blue-500 font-bold hover:text-blue-400 transition flex items-center justify-center gap-2">
            Start selling today <PlusCircle size={16} />
          </Link>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] p-6 md:p-8 rounded-[2.5rem] border border-gray-900 shadow-xl overflow-hidden">
          <h3 className="font-black mb-2 text-white uppercase tracking-widest text-xs opacity-50">Insights</h3>
          <p className="text-gray-400 font-medium leading-relaxed">
            Your inventory is live with <span className="text-white">{summary.productsCount} SKU(s)</span>. Monitoring active sales traffic.
          </p>
        </div>
      )}
    </div>
  );
}