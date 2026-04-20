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

  return (
    <div className="flex min-h-screen bg-black">
     
      <div className="hidden lg:block w-64 fixed h-full border-r border-gray-900">
        <Sidebar />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-black border-r border-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2 bg-gray-900 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="lg:hidden h-16 border-b border-gray-900 flex items-center justify-between px-4 sticky top-0 bg-black/50 backdrop-blur-md z-50">
          <span className="text-blue-500 font-black tracking-tighter italic">NEXUS SELLER</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white bg-gray-900 rounded-lg">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}