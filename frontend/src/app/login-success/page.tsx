"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

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
      router.push('/');
    }
  }, [searchParams, dispatch, router]);

  return <div className="text-white text-center p-10 text-2xl font-bold">Completing Login...</div>;
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <LoginSuccessHandler />
    </Suspense>
  );
}