"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Edit, Trash2, Loader2, PackageSearch, PlusCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/seller`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (res.ok) {
        toast.success(`${selectedProduct.name} purged from database`);
        setProducts(products.filter((p: any) => p._id !== selectedProduct._id));
        setIsModalOpen(false);
      } else {
        toast.error("Deletion protocol failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setDeleteLoading(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-16">
        <div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">MY PRODUCTS</h1>
          <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Manage your inventory ecosystem</p>
        </div>
        <Link href="/seller/add-product" className="w-full sm:w-auto bg-white p-4 rounded-2xl text-black hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-2 font-bold">
          <PlusCircle size={24} /> <span className="sm:hidden">ADD NEW</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={48} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-[#050505] rounded-[2.5rem] border-2 border-dashed border-gray-900">
          <PackageSearch size={56} className="mx-auto text-gray-800 mb-6" />
          <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Nexus Catalog is Empty</p>
          <Link href="/seller/add-product" className="mt-4 inline-block text-blue-500 font-bold hover:underline">Launch your first product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product: any) => (
            <div key={product._id} className="bg-[#0A0A0A] border border-gray-900 p-4 sm:p-6 rounded-4xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-blue-500/30 transition-all group shadow-xl">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-2xl border border-gray-800" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-lg sm:text-xl font-black text-white truncate group-hover:text-blue-400 transition">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-gray-900 px-2 py-1 rounded-md">{product.category}</span>
                    <span className="text-blue-500 font-mono font-bold">₹{product.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto border-t border-gray-900 sm:border-none pt-4 sm:pt-0">
                <button
                  onClick={() => router.push(`/seller/edit-product/${product._id}`)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-900 text-gray-400 hover:text-white hover:bg-blue-600 rounded-2xl transition-all font-bold text-sm"
                >
                  <Edit size={18} /> EDIT
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-bold text-sm shadow-inner"
                >
                  <Trash2 size={18} /> DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="DANGER ZONE"
        message={`This will permanently wipe "${selectedProduct?.name}" from NexusMart. Proceed with caution.`}
        loading={deleteLoading}
      />
    </div>
  );
}