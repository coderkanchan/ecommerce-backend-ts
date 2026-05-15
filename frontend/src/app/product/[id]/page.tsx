"use client";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { buyNowRequest } from '@/redux/slices/cartSlice';
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
        console.log("Full Product Data from DB:", data);
        setProduct(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (id) getProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: Number(qty),
      seller: product.user?._id || product.user || product.seller
    }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    dispatch(buyNowRequest({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: Number(qty),
      seller: product.user
    }));
    router.push('/shipping');
  };

  if (!product) {
    return <DetailSkeleton />;
  }
  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">

      <div className="flex-1 bg-white rounded-xl p-4">
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: 'auto',
            aspectRatio: '1/1',
            minHeight: '300px',
            position: 'relative'
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            unoptimized={product.imageUrl.includes('placeholder')}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="flex-1 space-y-4">

        <h1 className="text-4xl font-bold text-white">{product.name}</h1>

        <p className="text-2xl text-blue-400 font-bold">${product.price}</p>

        <p className="text-gray-400 leading-relaxed">{product.description}</p>

        <div className='flex items-center justify-between'>
          <div className="flex items-center gap-4 bg-gray-800 p-3 rounded-xl w-fit">
            <span className="text-gray-400 font-bold">Quantity:</span>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="bg-transparent text-white font-bold outline-none"
            >
              {[...Array(product.stock > 10 ? 10 : product.stock).keys()].map((x) => (
                <option key={x + 1} value={x + 1} className="bg-gray-800">
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 py-3 px-8 text-white  rounded-lg font-bold hover:bg-blue-700 cursor-pointer">
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full md:w-auto bg-amber-400 py-3 px-8 text-black rounded-lg font-bold hover:bg-amber-500 transition-colors shadow-md active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}