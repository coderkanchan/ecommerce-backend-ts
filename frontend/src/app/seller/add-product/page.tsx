"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Package, IndianRupee, Tag, Layers, Image as ImageIcon, Loader2, ArrowLeft, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size too large! Max 5MB allowed.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = "";

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`,
          },
          body: uploadData, 
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Image upload failed');
        finalImageUrl = uploadResult.image; 
      }

      const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl
        }),
      });

      const productData = await productRes.json();

      if (!productRes.ok) {
        throw new Error(productData.message || 'Failed to create product');
      }

      toast.success('Product published successfully! ✨');
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
        <Link href="/seller/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-black mb-2 italic tracking-tighter">ADD NEW PRODUCT</h1>
        <p className="text-gray-500 mb-10 text-lg">List your items in the high-performance NexusMart catalog.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-gray-900 shadow-2xl space-y-8">

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Product Visual</label>
              {!imagePreview ? (
                <div className="relative border-2 border-dashed border-gray-800 rounded-3xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-4">
                    <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition">
                      <UploadCloud className="text-gray-400" size={32} />
                    </div>
                    <div>
                      <p className="text-gray-300 font-bold text-lg">Select Product Image</p>
                      <p className="text-gray-600 text-sm mt-1">PNG, JPG or WebP (Max. 5MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-gray-800 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 p-3 rounded-full hover:scale-110 transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Essential Details</label>
              <div className="relative">
                <Package className="absolute left-4 top-4 text-gray-600" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Enter Product Name"
                  className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition font-medium"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Price (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-4 text-gray-600" size={20} />
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition font-mono"
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Inventory Stock</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-4 text-gray-600" size={20} />
                  <input
                    type="number"
                    required
                    placeholder="Quantity"
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition font-mono"
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Category Tag</label>
              <div className="relative">
                <Tag className="absolute left-4 top-4 text-gray-600" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Electronics, Fashion, Workspace etc."
                  className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Full Description</label>
              <textarea
                required
                rows={4}
                placeholder="Highlight your product's key features and specs..."
                className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-4 focus:border-blue-500 outline-none transition resize-none"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-[2rem] font-black text-xl tracking-tighter transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 disabled:bg-gray-800 disabled:text-gray-500"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                PUBLISH TO NEXUSMART
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}