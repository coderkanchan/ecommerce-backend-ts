"use client";
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products/all'); 
    const data = await res.json();
    setProducts(data.products); 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      fetchProducts();
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <button className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
              + Create Product
            </button>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-sm">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 flex gap-2">
                      <button className="text-blue-400 hover:underline">Edit</button>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}