import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Learn',
  description: 'Minimal Next.js + Tailwind starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen flex flex-col'>
        <CartProvider>
          <Navbar />
          <main className='flex-1 p-6'>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
