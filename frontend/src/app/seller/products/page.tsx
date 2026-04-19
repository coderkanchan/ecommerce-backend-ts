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

  useEffect(() => {
    fetchProducts();
  }, []);

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
        toast.success(`${selectedProduct.name} deleted successfully`);
        setProducts(products.filter((p: any) => p._id !== selectedProduct._id));
        setIsModalOpen(false);
      } else {
        toast.error("Could not delete product");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setDeleteLoading(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white">MY PRODUCTS</h1>
        <Link href="/seller/add-product" className="bg-blue-600 p-3 rounded-2xl text-white hover:bg-blue-700 transition active:scale-95">
          <PlusCircle size={24} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#111] rounded-[2rem] border border-dashed border-gray-800">
          <PackageSearch size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500 font-bold">No products found. Start adding some!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product: any) => (
            <div key={product._id} className="bg-[#111] border border-gray-800 p-5 rounded-3xl flex items-center justify-between hover:border-gray-600 transition-all group">
              <div className="flex items-center gap-6">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-2xl border border-gray-800" />
                <div>
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-sm text-gray-500 uppercase font-black tracking-widest">{product.category} • ₹{product.price}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/seller/edit-product/${product._id}`)}
                  className="p-3 bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition"
                >
                  <Trash2 size={20} />
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
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action is permanent and cannot be undone.`}
        loading={deleteLoading}
      />
    </div >
  );
}