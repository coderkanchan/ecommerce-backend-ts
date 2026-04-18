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
  TrendingUp,
  Loader2,
  AlertCircle ,
  LogOut
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
    <div className="min-h-screen bg-black text-white flex">

      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 hidden lg:flex flex-col p-6">
        <div className="text-2xl font-black tracking-tighter text-blue-500 mb-10">
          NEXUS<span className="text-white">MART</span>
        </div>
        <nav className="space-y-4">
          <Link href="/seller/dashboard" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-500 rounded-xl font-bold">
            <TrendingUp size={20} /> Dashboard
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-900 rounded-xl transition">
            <Package size={20} /> My Products
          </Link>
          <Link href="/seller/orders" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-900 rounded-xl transition">
            <ShoppingBag size={20} /> Orders
          </Link>
        </nav>
        <div className="mt-auto border-t border-gray-800 pt-6">
          <div className="flex items-center gap-3 px-2 py-3 bg-[#111] rounded-2xl border border-gray-800 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{userInfo?.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified Seller</p>
            </div>
          </div>

          <button
            //onClick={logoutHandler}
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Seller Central</h1>
            <p className="text-gray-500 mt-1">Welcome back, {userInfo?.name}. Here is your store summary.</p>
          </div>
          <Link
            href="/seller/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <PlusCircle size={20} /> Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Revenue" value={`₹${summary.totalSales.toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
          <StatCard title="Orders" value={summary.ordersCount} icon={ShoppingBag} color="bg-blue-500" />
          <StatCard title="Products" value={summary.productsCount} icon={Package} color="bg-purple-500" />
          <StatCard title="Customers" value={summary.customersCount} icon={Users} color="bg-orange-500" />
        </div>

        {summary.productsCount === 0 ? (
          <div className="bg-[#111] border-2 border-dashed border-gray-800 rounded-3xl p-20 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Aapne abhi tak koi product add nahi kiya hai. Apne business ko grow karne ke liye pehla product add karein.
            </p>
            <Link
              href="/seller/add-product"
              className="text-blue-500 font-bold hover:text-blue-400 underline decoration-2 underline-offset-4"
            >
              Start selling today →
            </Link>
          </div>
        ) : (
          <div className="bg-[#111] p-8 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-500 italic">Your store is active with {summary.productsCount} products. Check 'Orders' for new sales.</p>
          </div>
        )}
      </main>
    </div>
  );
}