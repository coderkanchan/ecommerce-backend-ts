"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import API from '@/services/api';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react'; 

function LoginSuccessHandler() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = searchParams.get('token');
      const redirectPath = searchParams.get('redirect') || '/';

      if (token) {
        try {
          const { data } = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const userInfo = { ...data, token };
          dispatch(setCredentials(userInfo));
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          toast.success(`Welcome back, ${data.name}!`, {
            description: "You've successfully logged in with Google.",
            icon: <Sparkles className="text-yellow-400" size={18} />,
            duration: 2000,
          });

          setTimeout(() => {
            router.push(redirectPath);
          }, 1500);
        } catch (error) {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
    fetchProfile();
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600/10 rounded-full animate-pulse">
            <Sparkles size={40} className="text-blue-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Securely logging you in</h1>
          <p className="text-gray-400 text-sm italic">Just a moment while we set up your session...</p>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping h-8 w-8 rounded-full bg-blue-500 opacity-20"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={<div className="bg-black h-screen" />}>
      <LoginSuccessHandler />
    </Suspense>
  );
}