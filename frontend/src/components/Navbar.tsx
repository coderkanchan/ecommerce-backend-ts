"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { clearCartItems } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import {
  ShoppingCart, User, Menu, LogOut, HelpCircle,
  ChevronRight, X, Settings, Store, LayoutDashboard
} from 'lucide-react';
import SearchBox from './SearchBox';
import { QUICK_FILTERS } from '@/constants/categoryData';
import Image from 'next/image';
import { toast } from 'sonner';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 0), 0);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCartItems());
    toast.success('Logged out successfully!', {
      description: 'Redirecting...', duration: 800
    });
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 w-full shadow-md sticky top-0 z-50">
        <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-white hover:bg-gray-800 rounded-lg transition"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="text-3xl font-bold text-blue-500 hover:text-blue-400 transition">
                NexusMart
              </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center px-8">
              <SearchBox />
            </div>

            <div className="flex items-center space-x-6">

              <div className="hidden lg:block">
                {mounted && (!userInfo || (userInfo.role !== 'seller' && !userInfo.isAdmin)) && (
                  <Link
                    href="/become-seller"
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                  >
                    <Store size={20} />
                    <span>Sell on NexusMart</span>
                  </Link>
                )}

                {mounted && userInfo?.role === 'seller' && (
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition"
                  >
                    <LayoutDashboard size={20} />
                    <span>Seller Panel</span>
                  </Link>
                )}
              </div>

              <Link href="/cart" className="relative text-white hover:text-blue-500 transition">
                <ShoppingCart size={28} />
                {mounted && cartCount > 0 && (
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
                      className="hidden sm:block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold text-white transition"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link href="/profile" className="flex items-center gap-2 outline-none">
                    {userInfo?.profileImage ? (
                      <Image
                        src={userInfo.profileImage}
                        alt="User"
                        width={35}
                        height={35}
                        className="rounded-full border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="hidden sm:block text-gray-400 hover:text-red-500 font-medium transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-300 hover:text-white text-sm transition">Login</Link>
                  <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-[350px] bg-white z-[300] transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="bg-gray-900 text-white p-5 flex items-center gap-3">
          <div className="w-12 h-12 relative bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl border border-gray-700 overflow-hidden">
            {mounted && userInfo?.profileImage ? (
              <Image src={userInfo.profileImage} alt={userInfo.name} fill className="object-cover" />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">{mounted && userInfo ? `Hello, ${userInfo.name}` : 'Sign in'}</p>
            <p className="font-bold text-base">Account & Lists</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto p-1 hover:bg-gray-800 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="py-4 text-gray-800">

          {mounted && (!userInfo || (userInfo.role !== 'seller' && !userInfo.isAdmin)) && (
            <div className="px-6 mb-4">
              <button
                onClick={() => { setIsSidebarOpen(false); router.push('/become-seller'); }}
                className="w-full bg-emerald-50 text-emerald-700 p-3 rounded-lg flex items-center gap-3 font-bold border border-emerald-200"
              >
                <Store size={20} /> Sell on NexusMart
              </button>
            </div>
          )}

          <div className="px-6 py-2">
            <h3 className="text-lg font-bold mb-2 text-gray-400 text-xs uppercase tracking-wider">Trending</h3>
            <ul className="space-y-3">
              <li className="hover:bg-gray-100 p-2 cursor-pointer rounded transition">Bestsellers</li>
              <li className="hover:bg-gray-100 p-2 cursor-pointer rounded transition">New Releases</li>
            </ul>
          </div>

          <hr className="my-4 border-gray-100" />

          <div className="px-6 py-2">
            <h3 className="text-lg font-bold mb-2 text-gray-400 text-xs uppercase tracking-wider">Shop By Category</h3>
            <ul className="space-y-1">
              {QUICK_FILTERS.map((cat) => (
                <li
                  key={cat}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded cursor-pointer transition text-gray-700"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    const url = cat === "All" ? '/' : `/?category=${cat}`;
                    router.push(url);
                  }}
                >
                  {cat} <ChevronRight size={16} className="text-gray-400" />
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-4 border-gray-100" />

          <div className="px-6 py-2 pb-10">
            <h3 className="text-lg font-bold mb-2 text-gray-400 text-xs uppercase tracking-wider">Help & Settings</h3>
            <ul className="space-y-3">
              <li
                onClick={() => { setIsSidebarOpen(false); router.push('/profile'); }}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition"
              >
                <User size={18} /> Your Account
              </li>

              {mounted && userInfo?.role === 'seller' && (
                <li
                  onClick={() => { setIsSidebarOpen(false); router.push('/seller/dashboard'); }}
                  className="flex items-center gap-3 p-2 hover:bg-purple-50 text-purple-700 rounded cursor-pointer transition font-medium"
                >
                  <LayoutDashboard size={18} /> Seller Dashboard
                </li>
              )}

              <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition text-gray-700">
                <HelpCircle size={18} /> Customer Service
              </li>

              {mounted && userInfo && (
                <li
                  onClick={() => { setIsSidebarOpen(false); logoutHandler(); }}
                  className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer font-medium mt-4 transition"
                >
                  <LogOut size={18} /> Sign Out
                </li>
              )}
            </ul>
          </div>

          {mounted && userInfo?.isAdmin && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Admin Controls</h3>
              <li
                onClick={() => { setIsSidebarOpen(false); router.push('/admin/dashboard'); }}
                className="flex items-center gap-3 p-2 hover:bg-blue-100 text-blue-700 rounded cursor-pointer transition list-none font-semibold"
              >
                <Settings size={18} /> Management Panel
              </li>
            </div>
          )}
        </div>
      </div>
    </>
  );
}