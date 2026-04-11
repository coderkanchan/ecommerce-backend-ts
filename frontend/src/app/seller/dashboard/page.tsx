"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag,
  TrendingUp, Users, PlusCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

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

  if (!isMounted || !userInfo || userInfo.role !== 'seller') return null;

  const stats = [
    { label: "Total Revenue", value: "₹0.00", icon: TrendingUp, color: "text-emerald-500" },
    { label: "Orders Received", value: "0", icon: ShoppingBag, color: "text-blue-500" },
    { label: "Active Products", value: "0", icon: Package, color: "text-purple-500" },
    { label: "Total Customers", value: "0", icon: Users, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          Seller Central
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/seller/dashboard" className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-gray-400">
            <Package size={20} /> My Products
          </Link>
          <Link href="/seller/orders" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-gray-400">
            <ShoppingBag size={20} /> Orders
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {userInfo.name}</h1>
            <p className="text-gray-500">Here's what's happening with your store today.</p>
          </div>
          <Link
            href="/seller/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
          >
            <PlusCircle size={20} /> Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${item.color}`}>
                  <item.icon size={24} />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{item.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Aapne abhi tak koi product list nahi kiya hai. Pehla product add karein aur bechna shuru karein!
          </p>
          <Link
            href="/seller/add-product"
            className="inline-block text-blue-600 font-bold hover:underline"
          >
            Get started by adding a product →
          </Link>
        </div>
      </main>
    </div>
  );
}