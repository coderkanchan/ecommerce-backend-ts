"use client";
import Sidebar from '@/components/seller/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'seller') {
      router.push('/login');
    }
  }, [userInfo, router]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-black font-sans">

      <aside className="hidden lg:block w-64 fixed h-full border-r border-gray-900 bg-[#0a0a0a] z-50">
        <Sidebar />
      </aside>

      <div className={`fixed inset-0 z-200 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'
        }`}>

        <div
          className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMenu}
        />

        <div className={`absolute inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-gray-900 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="p-5 flex justify-between items-center border-b border-gray-900">
            <span className="text-blue-500 font-black tracking-tighter italic">NEXUS SELLER</span>
            <button onClick={closeMenu} className="text-white p-2 bg-gray-900 rounded-xl active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar onItemClick={closeMenu} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <header className="h-16 border-b border-gray-900 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur-xl z-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white bg-gray-900 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Exit Store</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              Dashboard Mode
            </span>
            <Link href="/seller/profile"></Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-blue-500/20">
              {isClient ? userInfo?.name?.charAt(0).toUpperCase() : ""}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-10 max-w-400 mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}