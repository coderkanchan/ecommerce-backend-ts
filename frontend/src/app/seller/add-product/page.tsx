"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Package, IndianRupee, Tag, Layers, Loader2, ArrowLeft, UploadCloud, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
// Import corporate taxonomy configuration engine
import { CATEGORY_TREE } from '@/constants/categoryData';

export default function AddProductPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Synchronized state boundaries
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',     // L1 Parent Vector
    subCategory: '',  // L2 Child Node
    stock: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size limits breached! Max 5MB allowed.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview); // Memory cleanup protection
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please assign a Product Visual media asset before publishing.");
      return;
    }
    if (Number(formData.price) <= 0 || Number(formData.stock) < 0) {
      toast.error("Invalid monetary vector or negative stock metrics.");
      return;
    }
    if (!formData.category || !formData.subCategory) {
      toast.error("Taxonomy assignment incomplete! Parent and Sub-Category required.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = "";
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${userInfo?.token}` },
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Image upload tracking failed');
        finalImageUrl = uploadResult.image;
      }

      const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ ...formData, imageUrl: finalImageUrl }),
      });

      const productData = await productRes.json();
      if (!productRes.ok) throw new Error(productData.message || 'Failed to sync product data mapping');

      toast.success('Product deployed successfully to NexusMart ecosystem! ✨');
      router.push('/seller/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Fatal ecosystem operational pipeline error');
    } finally {
      setLoading(false);
    }
  };

  // Derive top-level categories array dynamically
  const parentCategories = Object.keys(CATEGORY_TREE);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-6 md:mb-10 group text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" /> Back to Nexus Console
        </Link>

        <h1 className="text-3xl md:text-5xl font-black mb-2 italic tracking-tighter">ADD NEW PRODUCT</h1>
        <p className="text-gray-500 mb-8 md:mb-12 text-sm md:text-sm uppercase tracking-widest font-semibold">
          Deploy high-quality assets to the NexusMart ecosystem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0A0A0A] p-5 sm:p-8 rounded-4xl border border-gray-900 shadow-2xl space-y-8">

            {/* Product Visual Section */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">
                Product Visual
              </label>
              {!imagePreview ? (
                <div className="relative border-2 border-dashed border-gray-900 rounded-3xl p-8 sm:p-14 text-center hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-4">
                    <div className="bg-gray-900 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition shadow-xl">
                      <UploadCloud className="text-blue-500" size={28} />
                    </div>
                    <div>
                      <p className="text-gray-300 font-bold">Select Media</p>
                      <p className="text-gray-600 text-[10px] mt-1">RAW, PNG, JPG (MAX 5MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video sm:aspect-auto sm:h-64 rounded-4xl overflow-hidden border border-gray-800 group shadow-2xl">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 p-3 rounded-full hover:scale-110 transition shadow-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Inputs Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Product Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Product Name
                </label>
                <div className="relative group">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    placeholder="Asset Identification Name"
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition font-medium text-sm text-white"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Price (INR)
                </label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <input
                    type="number"
                    name="price"
                    min="1"
                    step="0.01"
                    required
                    value={formData.price}
                    placeholder="0.00"
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition font-mono text-sm text-white"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Stock Units
                </label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    required
                    value={formData.stock}
                    placeholder="Available Quantity"
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition font-mono text-sm text-white"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Dropdown 1: Main Parent Category Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Classification Category
                </label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <select
                    name="category"
                    required
                    value={formData.category}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition text-sm appearance-none text-white cursor-pointer"
                    onChange={(e) => {
                      // Standard Reset Pattern: Jab parent badlega, child clear ho jayega
                      setFormData({ ...formData, category: e.target.value, subCategory: '' });
                    }}
                  >
                    <option value="" disabled className="text-gray-600">
                      Select Parent Vector
                    </option>
                    {parentCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0A0A0A] text-white py-2">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              {/* Dropdown 2: Dynamic Sub-Category Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Sub-Category Segment
                </label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <select
                    name="subCategory"
                    required
                    disabled={!formData.category} // Protected State Vector
                    value={formData.subCategory}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition text-sm appearance-none text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    onChange={handleInputChange}
                  >
                    <option value="" disabled className="text-gray-600">
                      {formData.category ? "Select Sub-Category Node" : "Awaiting Parent Vector..."}
                    </option>
                    {formData.category && CATEGORY_TREE[formData.category]?.map((sub) => (
                      <option key={sub} value={sub} className="bg-[#0A0A0A] text-white py-2">
                        {sub}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              {/* Asset Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-1">
                  Asset Description
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 text-gray-700 group-focus-within:text-blue-500 transition" size={18} />
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    placeholder="Detailed technical specifications, hardware compatibility grids, and functional parameters..."
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition resize-none text-sm text-white"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-blue-600 hover:text-white py-5 rounded-4xl font-black text-lg tracking-tighter transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "PUBLISH TO NEXUSMART"}
          </button>
        </form>
      </div>
    </div>
  );
}