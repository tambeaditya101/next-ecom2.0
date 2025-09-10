'use client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    // Clear the cart silently, no toast, only once
    clearCart();
  }, []);

  return (
    <div className='p-6 text-center'>
      <h1 className='text-2xl font-bold text-green-600 mb-4'>
        🎉 Order Placed Successfully!
      </h1>
      <p className='mb-6'>Thank you for shopping with us.</p>
      <Link
        href='/'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
      >
        Continue Shopping
      </Link>
    </div>
  );
}
