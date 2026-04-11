"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { Store, TrendingUp, Globe, ShieldCheck } from 'lucide-react';

const BecomeSellerPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleStartSelling = async () => {
  
    if (!userInfo) {
      toast.error("Please login first to become a seller");
      router.push('/login?redirect=/become-seller');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put('http://localhost:5000/api/auth/become-seller', {}, config);
      toast.success("Welcome! Your seller account is now active.");
      
      window.location.href = '/seller/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">

      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Sell on <span className="text-blue-500">NexusMart</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          Join thousands of businesses and reach millions of customers across the globe. 
          Everything you need to sell online is right here.
        </p>
        <button 
          onClick={handleStartSelling}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-2xl transition-all transform hover:scale-105"
        >
          {loading ? "Setting up..." : "Start Selling"}
        </button>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-12">
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Growth</h3>
          <p className="text-gray-600">Access millions of customers and scale your brand fast.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition">
          <Globe className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Easy Shipping</h3>
          <p className="text-gray-600">Our logistics network handles the heavy lifting for you.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition">
          <ShieldCheck className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Trust & Safety</h3>
          <p className="text-gray-600">Secure payments and dedicated seller support 24/7.</p>
        </div>
      </section>
    </div>
  );
};

export default BecomeSellerPage;