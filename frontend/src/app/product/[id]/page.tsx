"use client";
import { useDispatch } from 'react-redux';
import { addToCart, buyNowRequest } from '@/redux/slices/cartSlice';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import API from '@/services/api';
import DetailSkeleton from '@/components/DetailSkeleton';
import { toast } from 'sonner';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Critical telemetry synchronization system failure:", error);
        toast.error("Asset details compilation error.");
      }
    };
    if (id) getProduct();
  }, [id]);

  if (!product) return <DetailSkeleton />;

  const resolvedImageSrc = product.imageUrl && product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.imageUrl || '/placeholder.png'}`;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 text-black bg-white my-6 rounded-2xl shadow-sm">
      <div className="flex-1 bg-[#F7F8F8] rounded-2xl p-6 flex items-center justify-center border border-gray-100">
        <div className="relative w-full aspect-square max-w-[450px]">
          <Image
            src={resolvedImageSrc}
            alt={product.name}
            fill
            priority
            className="object-contain blend-multiply"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="flex-1 space-y-6 flex flex-col justify-center">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {product.category} / {product.subCategory}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 mt-3">{product.name}</h1>
        </div>

        <p className="text-3xl font-mono font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">{product.description}</p>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl w-fit">
            <span className="text-xs font-bold uppercase text-gray-500">Allocation Metrics:</span>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="bg-transparent text-gray-900 font-bold outline-none text-sm cursor-pointer"
            >
              {[...Array(product.stock > 10 ? 10 : product.stock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
            <button
              onClick={() => {
                dispatch(addToCart({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  imageUrl: resolvedImageSrc,
                  qty: Number(qty),
                  seller: product.seller?._id || product.seller || product.user
                }));
                toast.success("Ecosystem bucket updated successfully!");
              }}
              className="bg-gray-900 text-white py-4 px-6 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-98 transition-all"
            >
              Add to Basket
            </button>
            <button
              onClick={() => {
                dispatch(buyNowRequest({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  imageUrl: resolvedImageSrc,
                  qty: Number(qty),
                  seller: product.seller?._id || product.seller || product.user
                }));
                router.push('/shipping');
              }}
              className="bg-[#FFD814] hover:bg-[#F7CA00] text-black py-4 px-6 rounded-xl font-bold text-sm active:scale-98 transition-all shadow-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}