"use client";
import Sidebar from '@/components/seller/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'seller') {
      router.push('/login');
    }
  }, [userInfo, router]);
  
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}