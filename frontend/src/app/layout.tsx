"use client";
import Navbar from '@/components/Navbar';
import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";
import Script from 'next/script';
import { Toaster } from 'sonner';
import AIAssistant from '../components/AIAssistant';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isSellerPage = pathname.startsWith('/seller');

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {!isSellerPage && <Navbar />}

          <main>
            <Toaster position="top-center" richColors closeButton />
            {children}
            <AIAssistant />
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
            />
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}