"use client";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { removeFromCart, addToCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const checkoutHandler = () => {
    if (!userInfo) {
      router.push('/login?redirect=shipping');
    } else {
      router.push('/shipping');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-400 mb-6">Your NexusMart cart is empty!</h2>
          <Link href="/" className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-blue-400 font-bold">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit">
            <h2 className="text-xl font-bold mb-4">Subtotal ({cartItems.length} items)</h2>
            <p className="text-2xl font-bold text-blue-500 mb-6">${totalAmount.toFixed(2)}</p>
            <button className="w-full bg-yellow-500 text-black py-4 rounded-full font-bold hover:bg-yellow-600 transition">
              Proceed to Checkout
            </button>

            <button
              onClick={checkoutHandler}
              className="w-full bg-yellow-500 text-black py-4 rounded-full font-bold hover:bg-yellow-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}