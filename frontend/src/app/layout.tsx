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
            <Toaster position="top-center" richColors closeButton />
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