"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Edit, Trash2, Loader2, PackageSearch, PlusCircle } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">My <span className="text-blue-500">Products</span></h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage and audit your system marketplace stock</p>
        </div>
        <Link href="/seller/add-product" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 font-bold text-sm tracking-wide">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#050505] rounded-3xl border border-gray-900">
          <PackageSearch size={44} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Catalog Ecosystem is Empty</p>
          <Link href="/seller/add-product" className="mt-2 inline-block text-sm text-blue-500 font-semibold hover:underline">Launch your first product link</Link>
        </div>
      ) : (
        <div className="bg-[#060606] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-gray-900">
            {products.map((product) => (
              <div key={product._id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-gray-900/20 transition duration-300">
                <div className="flex items-center gap-5 w-full sm:w-auto min-w-0">
                  <div className="w-16 h-16 shrink-0 relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate max-w-70 lg:max-w-[400px]">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md">{product.category}</span>
                      <span className="text-sm font-mono font-bold text-blue-400">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => router.push(`/seller/edit-product/${product._id}`)}
                    className="flex-1 sm:flex-none p-2.5 bg-gray-900/60 hover:bg-blue-600/10 border border-gray-800 hover:border-blue-500/30 text-gray-400 hover:text-blue-400 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="flex-1 sm:flex-none p-2.5 bg-gray-900/60 hover:bg-red-600/10 border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="DANGER PROTOCOL"
        message={`This will permanently wipe "${selectedProduct?.name}" from the system catalog. Proceed?`}
        loading={deleteLoading}
      />
    </div>
  );
}