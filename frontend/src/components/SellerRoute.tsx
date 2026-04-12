"use client";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';

const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'seller') {
      router.push('/login');
    }
  }, [userInfo, router]);

  return userInfo && userInfo.role === 'seller' ? <>{children}</> : null;
};

export default SellerRoute;