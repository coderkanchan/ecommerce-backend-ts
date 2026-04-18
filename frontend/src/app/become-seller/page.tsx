"use client";
import { useState, useEffect } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCredentials } from '@/redux/slices/authSlice';
import { toast } from 'sonner';
import { Store, TrendingUp, Globe, ShieldCheck } from 'lucide-react';

export default function BecomeSellerPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('start') === 'true' && userInfo) {
      if (userInfo.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        handleStartSelling();
      }
    }
  }, [userInfo, router]);

  const handleStartSelling = async () => {
    if (!userInfo) {
      toast.info("Please login to start your seller journey");
      router.push('/login?redirect=/become-seller?start=true');
      return;
    }
    if (userInfo.role !== 'seller') {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await API.put('/users/become-seller', {}, config);

        dispatch(setCredentials(data));
        localStorage.setItem('userInfo', JSON.stringify(data));

        toast.success("Congratulations! You are now a Seller on NexusMart.");
        router.push('/seller/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    } else {
      router.push('/seller/dashboard');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Sell on <span className="text-blue-500">NexusMart</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          List your products on NexusMart and reach millions of customers.
          Beacome part of India's largest e-commerce network.
        </p>
        <button
          onClick={handleStartSelling}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? "Processing..." : "Start Selling Now"}
        </button>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-12">
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Fast Growth</h3>
          <p className="text-gray-600">Grow your sales 10x with our analytics and marketing tools.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <Globe className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Logistics Support</h3>
          <p className="text-gray-600">let us worry about shipping and delivery, and just focus on your business.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <ShieldCheck className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Secure Payments</h3>
          <p className="text-gray-600">Every 7 days, your earnings are safely transferred derectly to your bank account.</p>
        </div>
      </section>
    </div>
  );
}