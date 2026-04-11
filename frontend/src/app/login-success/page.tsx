"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import API from '@/services/api';
import { toast } from 'sonner';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = searchParams.get('token');

      if (token) {
        try {

          localStorage.setItem('tempToken', token);

          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const { data } = await API.get('/users/profile', config);

          const userData = { ...data, token };
          dispatch(setCredentials(userData));
          localStorage.setItem('userInfo', JSON.stringify(userData));
          localStorage.removeItem('tempToken');

          toast.success("Google Login Successful!");
          router.push('/');
        } catch (error) {
          toast.error("Failed to sync user data");
          router.push('/login');
        }
      }
    };

    fetchUserData();
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
      Verifying Google Account...
    </div>
  );
}