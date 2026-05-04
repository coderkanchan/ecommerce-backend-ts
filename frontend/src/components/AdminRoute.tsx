"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!userInfo || !userInfo.isAdmin) {
      alert("Access Denied! Admins only.");
      router.push('/'); 
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;