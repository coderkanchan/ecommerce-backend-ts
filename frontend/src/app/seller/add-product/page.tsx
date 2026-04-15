"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Package, IndianRupee, Tag, Layers, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${userInfo?.token}`,
  //       },
  //     };

  //     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products/add`, formData, config);
  //     toast.success('Product added successfully!');
  //     router.push('/seller/dashboard');
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || 'Something went wrong');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(formData), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success('Product added successfully! ✨');
      router.push('/seller/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/seller/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-black mb-2">Add New Product</h1>
        <p className="text-gray-500 mb-10">Fill in the details to list your product on NexusMart.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 space-y-6">

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Product Name</label>
              <div className="relative">
                <Package className="absolute left-4 top-3.5 text-gray-600" size={20} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Headphones"
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Price (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-3.5 text-gray-600" size={20} />
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Stock Quantity</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-3.5 text-gray-600" size={20} />
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-3.5 text-gray-600" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Electronics, Fashion, etc."
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your product features..."
                className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-3.5 text-gray-600" size={20} />
                <input
                  type="text"
                  required
                  placeholder="https://image-link.com"
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}