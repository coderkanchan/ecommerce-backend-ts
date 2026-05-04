"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2, Save, ArrowLeft, Package, Tag, IndianRupee, Layers, Link as LinkIcon, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name,
            price: data.price.toString(),
            description: data.description,
            category: data.category,
            stock: data.stock.toString(),
            imageUrl: data.imageUrl
          });
        } else {
          toast.error(data.message || "Failed to load product");
          router.push('/seller/products');
        }
      } catch (err) {
        toast.error("Error fetching product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Product updated successfully!");
        router.push('/seller/products');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error during update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={18} /> Cancel & Return
        </button>

        <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 text-white italic tracking-tighter">MODIFY ASSET</h1>

        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0A] p-6 sm:p-10 rounded-[2.5rem] border border-gray-900 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><Package size={12} /> Product Name</label>
            <input type="text" className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition text-sm font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><Tag size={12} /> Category</label>
            <input type="text" className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition text-sm font-medium" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><IndianRupee size={12} /> Valuation (₹)</label>
            <input type="number" className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition text-sm font-mono" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><Layers size={12} /> Current Stock</label>
            <input type="number" className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition text-sm font-mono" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><LinkIcon size={12} /> Media URL Source</label>
            <input type="text" className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition text-sm" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1 flex items-center gap-2"><Info size={12} /> Detailed Description</label>
            <textarea rows={5} className="w-full bg-black border border-gray-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition resize-none text-sm leading-relaxed" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <button type="submit" disabled={updating} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-4xl flex items-center justify-center gap-3 transition shadow-xl shadow-blue-900/20 disabled:opacity-50 mt-6 tracking-tighter text-lg">
            {updating ? <Loader2 className="animate-spin" /> : <Save size={22} />}
            UPDATE NEXUS ASSET
          </button>
        </form>
      </div>
    </div>
  );
}