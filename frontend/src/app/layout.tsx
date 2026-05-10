import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";
import Script from 'next/script';
import { Toaster } from 'sonner';
import NavbarWrapper from '../components/NavbarWrapper';
import AIAssistant from "@/components/AIAssistant";

export const metadata = {
  title: 'NexusMart | Best E-commerce Platform',
  description: 'Buy and sell products easily',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-10 overflow-x-hidden">
        <ReduxProvider>

          <NavbarWrapper />

          <main>
            <Toaster
              theme="dark" 
              position="top-center" 
              closeButton
              toastOptions={{
                style: {
                  background: '#111827',
                  color: '#fff',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                },
                className: 'my-custom-toast',
              }}
            />
            {children}
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
            />
          </main>

          <AIAssistant />

        </ReduxProvider>
      </body>
    </html>
  );
}