"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logout } from '@/redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/redux/store';
import { Package, ShoppingBag, TrendingUp, LogOut, Menu, X } from 'lucide-react';

export default function SideBar() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
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
  };

  const menuItems = [
    { name: 'Dashboard', icon: TrendingUp, href: '/seller/dashboard' },
    { name: 'My Products', icon: Package, href: '/seller/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/seller/orders' },
  ];

  if (!isMounted) return null;

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-900 z-[100] flex items-center justify-between px-4">
        <div className="text-xl font-black tracking-tighter text-blue-500">
          NEXUS<span className="text-white">MART</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-gray-900 rounded-xl">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[200] w-72 bg-[#0a0a0a] border-r border-gray-900 p-6 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="text-2xl font-black tracking-tighter text-blue-500 mb-10 hidden lg:block">
          NEXUS<span className="text-white">MART</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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

        <div className="mt-auto border-t border-gray-900 pt-6">
          <div className="flex items-center gap-3 px-3 py-4 bg-[#111] rounded-[1.5rem] border border-gray-800 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{userInfo?.name}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Verified Seller</p>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold active:scale-95"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <div className="h-16 lg:hidden" />
    </>
  );
}