"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { clearCartItems } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import SearchBox from './SearchBox';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);


  const router = useRouter();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearCartItems());
    router.push('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-gray-900 w-full shadow-md sticky top-0 z-50 ">

      <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-blue-500 hover:text-blue-400 transition">
              NexusMart
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBox />
          </div>

          <div className=" flex items-center justify-between space-x-6">

            <Link href="/cart" className="relative hover:text-blue-600">
              <span className=""><ShoppingCart size={40} /></span>
              {mounted && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5  flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {mounted && userInfo ? (
              <div className="flex items-center justify-between space-x-6">

                {userInfo.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="bg-blue-400 border px-4 py-2 rounded-xl text-xl font-bold text-white transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link href="/profile" className="flex items-center gap-2 text-white hover:text-blue-600">

                  {/* <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl px-4 py-2 font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div> */}
                  <div ><User size={30}/></div>

                  <span className="hidden sm:inline text-sm italic">Hi, {userInfo.name}</span>

                </Link>

                <button
                  onClick={logoutHandler}
                  className="bg-red-600  font-semibold rounded-xl text-xl px-4 py-2 text-white transition cursor-pointer"
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex items-center space-x-6">

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