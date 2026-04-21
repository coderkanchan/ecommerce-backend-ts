"use client";
import Sidebar from '@/components/seller/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'seller') {
      router.push('/login');
    }
  }, [userInfo, router]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden font-sans">

      <aside className="hidden lg:block w-64 fixed h-full border-r border-gray-900 z-50">
        <Sidebar />
      </aside>

      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
        }`}>
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMenu}
        />

        <div className={`absolute inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-gray-900 transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="p-4 flex justify-between items-center border-b border-gray-900">
            <span className="text-blue-500 font-black tracking-tighter italic">NEXUS SELLER</span>
            <button onClick={closeMenu} className="text-white p-2 bg-gray-900 rounded-xl hover:bg-gray-800">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar onItemClick={closeMenu} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <header className="lg:hidden h-16 border-b border-gray-900 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur-xl z-[100]">
          <span className="text-blue-500 font-black tracking-tighter italic text-xl">NEXUS<span className="text-white">MART</span></span>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}