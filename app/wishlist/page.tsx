'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) {
    return null; // 👈 avoids rendering anything until redirect
  }
  const { wishlist, toggleWishlist } = useCart();

  if (wishlist.length === 0)
    return (
      <div className='p-6 text-center'>
        <h2 className='text-xl font-bold mb-4'>Your wishlist is empty</h2>
        <Link href='/' className='text-blue-500 hover:underline'>
          Browse products
        </Link>
      </div>
    );

  return (
    <div className='p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4'>
      {wishlist.map((item, index) => (
        <div key={index} className='border p-4 rounded shadow relative'>
          <img
            src={item.image}
            alt={item.title}
            className='w-full h-40 object-cover mb-2 rounded'
          />
          <Link
            href={`/product/${item.id}`}
            className='text-blue-600 hover:underline font-medium'
          >
            <h2 className='font-semibold'>{item.title}</h2>
          </Link>
          <p>₹{item.price}</p>
          <button
            className='absolute top-2 right-2 text-red-500 text-lg'
            onClick={() => toggleWishlist(item)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
