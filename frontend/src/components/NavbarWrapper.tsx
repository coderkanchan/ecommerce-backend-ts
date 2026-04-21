"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isSellerPage = pathname.startsWith('/seller');

  if (isSellerPage) return null;
  return <Navbar />;
}