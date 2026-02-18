"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

export default function PlaceOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      if (!userInfo.token) {
        alert("Aapka session khatam ho gaya hai, please fir se login karein.");
        router.push('/login');
        return;
      }

      console.log("Sending Token:", userInfo.token); 

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            imageUrl: item.imageUrl,
            price: item.price,
            product: item._id
          })),
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            pincode: "125001" 
          },
          totalPrice: Number(totalPrice),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order Placed Successfully! 🎉");
        router.push(`/order/${data._id}`);
      } else {
        alert(data.message || "Order fail ho gaya");
      }
    } catch (err) {
      console.error("Order Error:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-4 text-white">

        <h1 className="text-3xl font-bold mb-8">Review Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 ">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-3">1. Shipping</h2>
              <p className="text-gray-400">
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-3">2. Payment Method</h2>
              <p className="text-gray-400"><strong>Method: </strong>PayPal</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

              <h2 className="text-xl font-bold mb-3">3. Order Items</h2>

              {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-4">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <Link href={`/product/${item._id}`} className="hover:text-blue-400">{item.name}</Link>
                      </div>
                      <p>{item.qty} x ${item.price} = <span className="font-bold">${(item.qty * item.price).toFixed(2)}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit">

            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 text-gray-400">
              <div className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${taxPrice}</span></div>
              <hr className="border-gray-800 my-4" />
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span><span>${totalPrice}</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              className="w-full bg-yellow-500 text-black mt-8 py-4 rounded-full font-bold hover:bg-yellow-600 transition"
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}