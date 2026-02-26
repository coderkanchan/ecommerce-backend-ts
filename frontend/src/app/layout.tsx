
import Navbar from '@/components/Navbar';
import './globals.css';
import { ReduxProvider } from "@/redux/ReduxProvider";
import Script from 'next/script';

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Navbar />
          <main>
            {children}
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