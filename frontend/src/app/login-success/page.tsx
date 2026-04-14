"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import API from '@/services/api';
import { toast } from 'sonner';

function LoginSuccessHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();


  useEffect(() => {
    const fetchProfile = async () => {
      const token = searchParams.get('token');
     
      const redirect = searchParams.get('redirect') || '/';

      if (token) {
        try {
          const { data } = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const userInfo = { ...data, token };
          dispatch(setCredentials(userInfo));
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          toast.success(`Welcome back, ${data.name}!`);

          setTimeout(() => {
            router.push(redirectPath);
          }, 800);
        } catch (error) {
          toast.error('Failed to sync user data.');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
    fetchProfile();
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying Session...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={<div className="bg-gray-900 h-screen" />}>
      <LoginSuccessHandler />
    </Suspense>
  );
}