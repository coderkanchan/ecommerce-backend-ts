"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; 

const BecomeSellerPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put('http://localhost:5000/api/auth/become-seller', {}, config);

      toast.success("Mubarak ho! Ab aap ek Seller hain.");

      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Kuch galat hua. Phir se koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">NexusMart Seller Center</h2>
          <p className="mt-4 text-sm text-gray-600">
            Apne products ko NexusMart par bechna shuru karein aur apne business ko badhayein.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm bg-blue-50 p-4 border-l-4 border-blue-500">
            <p className="text-sm text-blue-700">
              Upgrading to a <strong>Seller Account</strong> will allow you to add products,
              track orders, and view your sales analytics.
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all`}
          >
            {loading ? "Process ho raha hai..." : "Confirm & Become a Seller"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;