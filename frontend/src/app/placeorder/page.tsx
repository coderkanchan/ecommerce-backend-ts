"use client";
import { createRazorpayOrder } from '@/services/api';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCartItems } from "@/redux/slices/cartSlice";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function PlaceOrderPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const { paymentMethod } = useSelector((state: RootState) => state.cart);

  const placeOrderHandler = async () => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (!storedUser) { router.push('/login'); return; }
      const userInfo = JSON.parse(storedUser);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            imageUrl: item.image || item.imageUrl,
            price: item.price,
            product: item._id,
            seller: item.seller,
          })),
          shippingAddress: shippingAddress,
          totalPrice: Number(totalPrice),
          paymentMethod: paymentMethod,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.message);

      if (paymentMethod === 'COD') {
        alert("Order Placed Successfully via COD! 📦");
        dispatch(clearCartItems());
        localStorage.removeItem('cartItems');
        router.push(`/profile`);

      } else {

        const paymentResponse = await createRazorpayOrder(Number(totalPrice));

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentResponse.order.amount,
          currency: "INR",
          name: "NexusMart",
          order_id: paymentResponse.order.id,
          handler: async function (response: any) {

            try {
              const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderData._id}/pay`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  status: 'completed',
                  email: userInfo.email
                }),
              });

              if (!payRes.ok) throw new Error("Failed to update order status on server");

              alert("Order Placed & Payment Successful! 🎉");
              dispatch(clearCartItems());
              localStorage.removeItem('cartItems');
              router.push(`/profile`);

            } catch (innerErr: any) {
              alert("Payment was successful but server update failed. Please contact support.");
              console.error(innerErr);
            }
          },
          prefill: { name: userInfo.name, email: userInfo.email },
          theme: { color: "#EAB308" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (err: any) {
      alert(err.message || "Something went wrong!");
    }
  };

  if (!isMounted) return null;

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

              <p>
                <strong>Method: </strong>
                {cart.paymentMethod === 'COD' ? 'Cash On Delivery' : 'Online Payment (Razorpay)'}
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

              <h2 className="text-xl font-bold mb-3">3. Order Items</h2>

              {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded" />
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

              <div className="flex justify-between">
                <span>Items</span><span>${itemsPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span><span>${shippingPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span><span>${taxPrice}</span>
              </div>

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