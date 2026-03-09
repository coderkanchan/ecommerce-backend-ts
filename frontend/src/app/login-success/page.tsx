"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

export default function LoginSuccess() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');

    if (token) {
      const userInfo = { token, name, email: searchParams.get('email'), isAdmin: searchParams.get('isAdmin') === 'true', _id: searchParams.get('id') };
      dispatch(setCredentials(userInfo));
      router.push('/');
    }
  }, []);

  return <div className="text-white text-center p-10">Completing Login...</div>;
}