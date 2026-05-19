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
    <div className="flex min-h-screen bg-black font-sans antialiased text-white selection:bg-blue-500/30">
      {/* Desktop Sidebar Container */}
      <aside className="hidden lg:block w-64 fixed h-full border-r border-gray-900 bg-[#0a0a0a] z-50">
        <Sidebar />
      </aside>

      {/* Mobile Drawer Slide-over */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />
        <div className={`absolute inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-gray-900 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-gray-900">
            <span className="text-blue-500 font-black tracking-tighter italic text-lg">NEXUS PANEL</span>
            <button onClick={closeMenu} className="text-white p-2.5 bg-gray-900/60 border border-gray-800 rounded-xl active:scale-90 transition-transform cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar onItemClick={closeMenu} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-64 w-full min-w-0">
        <header className="h-16 border-b border-gray-900 flex items-center justify-between px-6 sticky top-0 bg-black/70 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white bg-gray-900 border border-gray-800 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Exit Store</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
              Dashboard Node
            </span>
            <Link href="/seller/profile">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-blue-500/20 active:scale-95 transition-transform">
                {isClient ? userInfo?.name?.charAt(0).toUpperCase() : ""}
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full box-border">
          {children}
        </main>
      </div>
    </div>
  );
}