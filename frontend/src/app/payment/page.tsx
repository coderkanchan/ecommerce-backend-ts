"use client";
import { useState, useEffect, Suspense } from 'react'; 
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';

function PaymentContent() {
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    router.push('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl border border-gray-800">
      <h1 className="text-3xl font-bold text-white mb-6">Payment Method</h1>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-black border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <input
              type="radio"
              id="Razorpay"
              name="paymentMethod"
              value="Razorpay"
              checked={paymentMethod === 'Razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-blue-600"
            />
            <label htmlFor="Razorpay" className="ml-4 text-white font-medium cursor-pointer">
              Online Payment (Razorpay / Cards / UPI)
            </label>
          </div>

          <div className="flex items-center p-4 bg-black border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <input
              type="radio"
              id="COD"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-blue-600"
            />
            <label htmlFor="COD" className="ml-4 text-white font-medium cursor-pointer">
              Cash On Delivery (COD)
            </label>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
          Continue to Review
        </button>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading Payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}