
"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ShippingPage() {
  const { shippingAddress } = useSelector((state: RootState) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [pincode, setPincode] = useState(shippingAddress.pincode || '');

  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, pincode }));
    router.push('/payment'); 
  };
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6">Shipping Address</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Full Address"
            className="w-full p-4 bg-black border border-gray-700 rounded-lg text-white"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="p-4 bg-black border border-gray-700 rounded-lg text-white"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Pincode"
              className="p-4 bg-black border border-gray-700 rounded-lg text-white"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
            Continue to Payment
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

