"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { clearCartItems } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // const logoutHandler = () => {
  //   dispatch(logout());
  //   router.push('/login');
  // };
  const logoutHandler = () => {
    dispatch(logout()); 
    dispatch(clearCartItems()); 
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400    transition">
              NexusMart
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                className="w-full bg-black border border-gray-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products..."
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
          </div>

          <div className="flex items-center space-x-6">

            <Link href="/cart" className="relative hover:text-blue-600">
              <span className="text-2xl"><ShoppingCart /></span>
              {mounted && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {mounted && userInfo ? (
              <div className="flex items-center space-x-4">

                {userInfo.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-600 hover:text-white transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm italic">Hi, {userInfo.name}</span>
                </Link>

                <button
                  onClick={logoutHandler}
                  className="bg-red-600/10 text-red-500 border border-red-600/20 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition "
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex items-center space-x-4">

                <Link href="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>

                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                  Signup
                </Link>

              </div>
            )}

            <button className="md:hidden text-gray-300">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}