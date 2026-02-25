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
  const [keyword, setKeyword] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = ["Electronics", "Fashion", "Home", "Books", "Toys", "Beauty"];
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCartItems());
    router.push('/login');
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?keyword=${keyword}`);
    } else {
      router.push('/');
    }
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

          <form onSubmit={submitHandler} className="hidden md:flex flex-1 justify-center px-8">
            <div className="flex w-full max-w-2xl bg-white rounded-md overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">

              <select
                className="bg-gray-100 text-gray-700 text-sm px-3 border-r border-gray-300 outline-none cursor-pointer hover:bg-gray-200"
                onChange={(e) => router.push(e.target.value === 'All' ? '/' : `/?category=${e.target.value}`)}
              >
                <option value="All">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="grow py-2 px-4 text-black outline-none"
                placeholder="Search NexusMart..."
              />

              <button
                type="submit"
                className="bg-blue-600 px-5 text-white hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

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