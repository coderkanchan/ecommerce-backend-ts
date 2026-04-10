"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

const BecomeSellerPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put('http://localhost:5000/api/auth/become-seller', {}, config);
      toast.success("Welcome to the Seller Family!");
      router.push('/profile');
    } catch (error: any) {
      toast.error("Process failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Becho NexusMart Par</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Apne products ko lakhon logon tak pahuchaiye aur apna business grow karein.
        </p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
        >
          {loading ? "Processing..." : "Start Selling Now"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="text-blue-500" />}
          title="Quick Setup"
          desc="Bas ek click mein apna seller account active karein."
        />
        <FeatureCard
          icon={<ShieldCheck className="text-blue-500" />}
          title="Secure Payments"
          desc="Aapki kamayi seedha aapke bank account mein safely pahunchegi."
        />
        <FeatureCard
          icon={<BarChart3 className="text-blue-500" />}
          title="Analytics"
          desc="Powerful dashboard se apni sales aur growth track karein."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 border rounded-xl hover:shadow-md transition text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default BecomeSellerPage;