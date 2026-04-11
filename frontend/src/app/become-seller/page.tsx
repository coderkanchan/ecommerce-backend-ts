"use client";
import { useState } from 'react';
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

  const handleStartSelling = async () => {
   
    if (!userInfo) {
      toast.info("Aapko pehle login karna hoga seller banne ke liye.");
      router.push('/login?redirect=/become-seller');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put('/users/become-seller'); 

      dispatch(setCredentials(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success("Mubarak ho! Aap ab NexusMart ke seller hain.");
      router.push('/seller/dashboard'); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Role upgrade failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Sell on <span className="text-blue-500">NexusMart</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          Apne products ko NexusMart par list karein aur lakhon customers tak pahunchein.
          India ke sabse bade e-commerce network ka hissa banein.
        </p>
        <button
          onClick={handleStartSelling}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? "Process ho raha hai..." : "Start Selling Now"}
        </button>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-12">
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Fast Growth</h3>
          <p className="text-gray-600">Apni sales ko 10x grow karein hamare analytics aur marketing tools ke sath.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <Globe className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Logistics Support</h3>
          <p className="text-gray-600">Shipping aur Delivery ki chinta humein de dein, aap sirf apne business par dhyan dein.</p>
        </div>
        <div className="text-center p-8 border rounded-2xl hover:shadow-xl transition-shadow">
          <ShieldCheck className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-black">Secure Payments</h3>
          <p className="text-gray-600">Harr 7 din mein aapki kamayi seedha aapke bank account mein safely transfer hoti hai.</p>
        </div>
      </section>
    </div>
  );
}