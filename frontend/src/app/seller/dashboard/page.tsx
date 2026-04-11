"use client";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'seller') {
      router.push('/');
    }
  }, [userInfo, router]);

  if (!userInfo || userInfo.role !== 'seller') return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
      <p className="text-gray-600">Welcome to your store management panel.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold">₹0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 text-sm">Active Products</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-gray-500 text-sm">New Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}