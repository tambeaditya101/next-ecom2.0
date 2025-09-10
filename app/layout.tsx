import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CartProvider, useCart } from '@/context/CartContext';
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

  // Global toast component
  function GlobalToasts() {
    const { toasts } = useCart();

    return (
      <div className='fixed top-16 right-4 flex flex-col gap-2 z-50'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className='bg-green-500 text-white px-4 py-2 rounded shadow transform transition-all duration-300 opacity-100 translate-y-0'
          >
            {toast.message}
          </div>
        ))}
      </div>
    );
  }
}
