// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import API from '@/services/api';
// import Link from 'next/link';

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getProducts = async () => {
//       try {
//         const { data } = await API.get('/products/all');
//         setProducts(data.products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getProducts();
//   }, []);

//   if (loading) return <div className="p-10 text-center">Loading Products...</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">New Arrivals</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product: any) => (
//           <div key={product._id} className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
//             <div className="h-64 overflow-hidden">
//               {/* <img
//                 src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
//                 alt={product.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//               /> */}
//               <img
//                 // imageUrl backend se aa raha hai, use check karein
//                 src={product.imageUrl && product.imageUrl.startsWith('http')
//                   ? product.imageUrl
//                   : `http://localhost:5000${product.imageUrl}`}
//                 alt={product.name}
//                 // isse image card mein fit ho jayegi
//                 className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
//               />
//               // Map ke andar card ko wrap karein
//               <Link href={`/product/${product._id}`} key={product._id}>
//                 <div className="group border ...">
//                   {/* Aapka purana card code yahan */}
//                 </div>
//               </Link>
//             </div>
//             <div className="p-4">
//               <h2 className="font-semibold text-lg text-gray-900 truncate">{product.name}</h2>
//               <p className="text-blue-600 font-bold text-xl mt-2">${product.price}</p>
//               <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg hover:bg-blue-600 transition">
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from 'react';
import API from '@/services/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await API.get('/products/all');
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) return <div className="p-10 text-center text-white">Loading Products...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">New Arrivals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          /* Pura Card ab ek Link hai */
          <Link href={`/product/${product._id}`} key={product._id} className="group border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition bg-gray-900">
            <div className="h-64 overflow-hidden bg-white">
              <img
                src={product.imageUrl && product.imageUrl.startsWith('http')
                  ? product.imageUrl
                  : `http://localhost:5000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-lg text-white truncate">{product.name}</h2>
              <p className="text-blue-400 font-bold text-xl mt-2">${product.price}</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}