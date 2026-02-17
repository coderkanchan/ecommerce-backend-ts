"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment Method Selected:", paymentMethod);
    router.push('/placeorder');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Payment Method</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">

            <label className="flex items-center p-4 bg-black border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition">
              <input
                type="radio" name="paymentMethod" value="PayPal" checked
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="ml-4 text-white font-medium">PayPal or Credit Card</span>
            </label>

            <label className="flex items-center p-4 bg-black border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition">
              <input
                type="radio" name="paymentMethod" value="COD"
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="ml-4 text-white font-medium">Cash on Delivery (COD)</span>
            </label>
          </div>

          <button className="w-full bg-yellow-500 text-black py-4 rounded-full font-bold hover:bg-yellow-600 transition">
            Continue to Place Order
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}