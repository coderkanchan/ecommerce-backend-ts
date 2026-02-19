// "use client";
// import { useEffect, useState } from 'react';
// import AdminSidebar from '@/components/AdminSidebar';
// import AdminRoute from '@/components/AdminRoute';

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState(0);
//   const [category, setCategory] = useState('');
//   const [stock, setStock] = useState(0);
//   const [imageUrl, setImageUrl] = useState('');
//   const [description, setDescription] = useState('');

//   const fetchProducts = async () => {
//     const res = await fetch('http://localhost:5000/api/products/all');
//     const data = await res.json();
//     setProducts(data.products);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const deleteHandler = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${userInfo.token}` },
//       });
//       fetchProducts();
//     }
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

//     try {
//       const res = await fetch('http://localhost:5000/api/products/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//         body: JSON.stringify({ name, price, category, stock, imageUrl, description }),
//       });

//       if (res.ok) {
//         alert("Product Created! 🎉");
//         setShowModal(false);
//         fetchProducts();
//       }
//     } catch (err) {
//       alert("Error creating product");
//     }
//   };

//   return (
//     <AdminRoute>
//       <div className="flex min-h-screen bg-black text-white">
//         <AdminSidebar />
//         <main className="flex-1 p-8">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold">Products</h1>
//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
//               + Create Product
//             </button>
//           </div>

//           {showModal && (
//             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

//               <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">

//                 <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

//                 <form onSubmit={submitHandler} className="space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Product Name"
//                     className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />

//                   <div className="grid grid-cols-2 gap-4">
//                     <input
//                       type="number"
//                       placeholder="Price"
//                       className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                       onChange={(e) => setPrice(Number(e.target.value))}
//                       required
//                     />
//                     <input
//                       type="number"
//                       placeholder="Stock"
//                       className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                       onChange={(e) => setStock(Number(e.target.value))}
//                       required
//                     />
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="Category"
//                     className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                     onChange={(e) => setCategory(e.target.value)}
//                     required
//                   />

//                   <input
//                     type="text"
//                     placeholder="Image URL (Link)"
//                     className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                     onChange={(e) => setImageUrl(e.target.value)}
//                     required
//                   />

//                   <textarea
//                     placeholder="Description"
//                     className="w-full p-3 bg-black border border-gray-700 rounded-lg"
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                   />

//                   <div className="flex gap-4 mt-6">
//                     <button
//                       type="submit"
//                       className="flex-1 bg-blue-600 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
//                       Save Product
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => setShowModal(false)}
//                       className="flex-1 bg-gray-800 py-3 rounded-lg font-bold hover:bg-gray-700 transition text-gray-400">
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
//             <table className="w-full text-left">
//               <thead className="bg-gray-800 text-gray-300 uppercase text-sm">
//                 <tr>
//                   <th className="p-4">Name</th>
//                   <th className="p-4">Price</th>
//                   <th className="p-4">Category</th>
//                   <th className="p-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800">
//                 {products.map((product: any) => (
//                   <tr key={product._id} className="hover:bg-gray-800/50 transition">
//                     <td className="p-4">{product.name}</td>
//                     <td className="p-4">${product.price}</td>
//                     <td className="p-4">{product.category}</td>
//                     <td className="p-4 flex gap-4">
//                       <button className="text-blue-400 hover:underline">
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteHandler(product._id)}
//                         className="text-red-400 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </AdminRoute>
//   );
// }



"use client";
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null); 
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products/all');
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const closeModalHandler = () => {
    setShowModal(false);
    setEditingId(null);
    setName(''); setPrice(0); setCategory(''); setStock(0); setImageUrl(''); setDescription('');
  };

  const editHandler = (product: any) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setShowModal(true); 
  };

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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : 'http://localhost:5000/api/products/add';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, price, category, stock, imageUrl, description }),
      });

      if (res.ok) {
        alert(editingId ? "Product Updated! ✨" : "Product Created! 🎉");
        closeModalHandler();
        fetchProducts();
      }
    } catch (err) {
      alert("Error saving product");
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
              + Create Product
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

                <form onSubmit={submitHandler} className="space-y-4">
                  <input type="text" placeholder="Product Name" className="w-full p-3 bg-black border border-gray-700 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price" className="w-full p-3 bg-black border border-gray-700 rounded-lg" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                    <input type="number" placeholder="Stock" className="w-full p-3 bg-black border border-gray-700 rounded-lg" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
                  </div>
                  <input type="text" placeholder="Category" className="w-full p-3 bg-black border border-gray-700 rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  <input type="text" placeholder="Image URL (Link)" className="w-full p-3 bg-black border border-gray-700 rounded-lg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                  <textarea placeholder="Description" className="w-full p-3 bg-black border border-gray-700 rounded-lg h-32" value={description} onChange={(e) => setDescription(e.target.value)} required />

                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                      {editingId ? 'Update Product' : 'Save Product'}
                    </button>
                    <button type="button" onClick={closeModalHandler} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold hover:bg-gray-700 transition text-gray-400">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-sm font-semibold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-800/50 transition duration-200">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4 text-green-400 font-medium">${product.price}</td>
                    <td className="p-4 text-gray-400">{product.category}</td>
                    <td className="p-4 flex gap-4">

                      <button
                        onClick={() => editHandler(product)}
                        className="text-blue-400 hover:text-blue-300 font-semibold">
                        Edit
                      </button>

                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="text-red-400 hover:text-red-300 font-semibold">
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