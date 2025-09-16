import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextLearn store',
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
          <AuthProvider>
            <Navbar />
            <main className='flex-1'>
              {children}
              <Toaster position='top-right' reverseOrder={false} />
            </main>
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
