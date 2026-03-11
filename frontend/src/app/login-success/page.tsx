"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { toast } from 'sonner';

function LoginSuccessHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const profileImage = searchParams.get('profileImage');

    if (token) {
      const userInfo = {
        token,
        name: searchParams.get('name'),
        email: searchParams.get('email'),
        isAdmin: searchParams.get('isAdmin') === 'true',
        _id: searchParams.get('id'),
        profileImage,
      };

      dispatch(setCredentials(userInfo));

      toast.success(`Welcome back, ${name}!`, {
        description: 'Google Login Successful 🚀',
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      toast.error('Google Login Failed. Please try again.');
      router.push('/login');
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  )
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <LoginSuccessHandler />
    </Suspense>
  );
}