"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from '@/redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/redux/store';
import { Package, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';

export default function SideBar({ onItemClick }: { onItemClick?: () => void }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    router.push('/login');
    if (onItemClick) onItemClick();
  };

  const menuItems = [
    { name: 'Dashboard', icon: TrendingUp, href: '/seller/dashboard' },
    { name: 'My Products', icon: Package, href: '/seller/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/seller/orders' },
  ];

  return (
    <aside className="flex flex-col h-full p-6 bg-[#0a0a0a]">
      <div className="text-2xl font-black tracking-tighter text-blue-500 mb-10 hidden lg:block uppercase italic">
        Nexus<span className="text-white font-black">Mart</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all active:scale-95 ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                }`}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-900 pt-6 cursor-pointer">
        <Link href="/seller/profile" className="flex items-center gap-3 px-3 py-4 bg-[#111] rounded-3xl border border-gray-800 mb-4">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white shrink-0">
            {isMounted && userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white uppercase tracking-tight">
              {isMounted ? userInfo?.name || 'Seller' : 'Loading...'}
            </p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Verified Seller</p>
          </div>
        </Link>

        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold active:scale-95 cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}