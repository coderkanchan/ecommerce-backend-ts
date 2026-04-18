"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2, Package, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyProductsPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/seller`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [userInfo]);

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });

        if (res.ok) {
          setProducts(products.filter((p: any) => p._id !== id));
          toast.success("Product deleted successfully");
        }
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-black mb-8">MY PRODUCTS</h1>
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="grid gap-4">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: any) => (
              <div key={product._id} className="bg-[#111] border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.category} • ₹{product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg"><Edit size={18} /></button>
                  <button onClick={deleteHandler} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products found. Start adding some!
            </div>
          )}
        </div>
      )}
    </div>
  );
}