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
  ChevronRight, X, Settings, Store, LayoutDashboard, Search
} from 'lucide-react';
import SearchBox from './SearchBox';
import { QUICK_FILTERS } from '@/constants/categoryData';
import Image from 'next/image';
import { toast } from 'sonner';
import AIAssistant from '../components/AIAssistant';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (isSearchFocused) setIsSearchFocused(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearchFocused]);

  return (
    <>
      {isSearchFocused && (
        <div
          className="fixed inset-0 bg-black/60 z-80 backdrop-blur-[2px]"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
      <nav className="bg-gray-800 backdrop-blur-md w-full shadow-lg sticky top-0 z-100 border-b border-gray-800">

        <div className="max-w-375 mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-2">

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-white hover:bg-gray-800 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Menu size={26} />
              </button>
              <Link href="/" className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-500">
                  NEXUS<span className="text-white">MART</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="w-full transform transition-all duration-300 focus-within:scale-[1.01]">
                <SearchBox onFocusChange={(val) => setIsSearchFocused(val)} />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-5 shrink-0">
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <Search size={24} />
              </button>

              <div className="flex items-center">
                <AIAssistant />
              </div>

              <div className="hidden xl:flex items-center gap-4">
                {mounted && (!userInfo || (userInfo.role !== 'seller' && !userInfo.isAdmin)) && (
                  <Link href="/become-seller" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 transition">
                    <Store size={16} /> <span>Sell</span>
                  </Link>
                )}
                {mounted && userInfo?.role === 'seller' && (
                  <Link href="/seller/dashboard" className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/20 transition">
                    <LayoutDashboard size={16} /> <span>Seller Panel</span>
                  </Link>
                )}
              </div>

              <Link href="/cart" className="relative p-2 text-white hover:text-blue-400 transition-colors group">
                <ShoppingCart size={26} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ring-2 ring-gray-900 group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                {mounted && userInfo ? (
                  <>
                    <Link href="/profile" className="flex items-center transition-transform active:scale-90">
                      {userInfo?.profileImage ? (
                        <div className="relative w-9 h-9 rounded-full ring-2 ring-blue-500/50 p-0.5">
                          <Image src={userInfo.profileImage} alt="User" width={36} height={36} className="rounded-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-blue-500/30">
                          {userInfo?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <button onClick={logoutHandler} className="hidden sm:block text-xs font-bold text-gray-500 hover:text-red-500 tracking-wider uppercase transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="hidden sm:block text-sm font-bold text-gray-400 hover:text-white transition">Login</Link>
                    <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-900/20">
                      Join
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${showMobileSearch ? 'max-h-20 pb-4' : 'max-h-0'}`}>
            <SearchBox />
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-200 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`fixed top-0 left-0 h-full w-70 sm:w-[320px] bg-white z-300 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="bg-gray-900 text-white p-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 relative bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl border border-white/10 overflow-hidden">
              {mounted && userInfo?.profileImage ? (
                <Image src={userInfo.profileImage} alt={userInfo.name} fill className="object-cover" />
              ) : (
                <User size={28} />
              )}
            </div>
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{mounted && userInfo ? `Welcome` : 'NexusMart'}</p>
              <p className="font-extrabold text-lg leading-tight">{mounted && userInfo ? userInfo.name : 'Sign In Now'}</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="py-6 space-y-6">

          {mounted && (!userInfo || (userInfo.role !== 'seller' && !userInfo.isAdmin)) && (
            <div className="px-4">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push(userInfo ? '/become-seller' : '/login?redirect=/become-seller');
                }}
                className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition"
              >
                <Store size={22} /> Sell on NexusMart
              </button>
            </div>
          )}

          <div className="px-2">
            <SectionTitle title="Trending" />
            <NavItem label="Bestsellers" />
            <NavItem label="New Releases" />
          </div>

          <div className="px-2">
            <SectionTitle title="Shop By Category" />
            <div className="grid grid-cols-1 gap-1">
              {QUICK_FILTERS.map((cat) => (
                <li
                  key={cat}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all group list-none"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    router.push(cat === "All" ? '/' : `/?category=${cat}`);
                  }}
                >
                  <span className="text-gray-700 font-medium group-hover:text-blue-600">{cat}</span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </li>
              ))}
            </div>
          </div>

          <div className="px-2 border-t border-gray-100 pt-6">
            <SectionTitle title="Help & Settings" />
            <NavItem icon={<User size={18} />} label="Your Account" onClick={() => { setIsSidebarOpen(false); router.push('/profile'); }} />

            {mounted && userInfo?.role === 'seller' && (
              <NavItem
                icon={<LayoutDashboard size={18} />}
                label="Seller Panel"
                variant="purple"
                onClick={() => { setIsSidebarOpen(false); router.push('/seller/dashboard'); }}
              />
            )}

            {mounted && userInfo?.isAdmin && (
              <NavItem
                icon={<Settings size={18} />}
                label="Admin Management"
                variant="blue"
                onClick={() => { setIsSidebarOpen(false); router.push('/admin/dashboard'); }}
              />
            )}

            <NavItem icon={<HelpCircle size={18} />} label="Customer Service" />

            {mounted && userInfo && (
              <button
                onClick={() => { setIsSidebarOpen(false); logoutHandler(); }}
                className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-colors mt-4"
              >
                <LogOut size={20} /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
);

const NavItem = ({ label, icon, onClick, variant = "default" }: any) => {
  const themes: any = {
    default: "hover:bg-gray-50 text-gray-700",
    purple: "hover:bg-purple-50 text-purple-700 font-bold",
    blue: "hover:bg-blue-50 text-blue-700 font-bold",
  };
  return (
    <div onClick={onClick} className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${themes[variant]}`}>
      {icon} <span className="text-[15px]">{label}</span>
    </div>
  );
};
