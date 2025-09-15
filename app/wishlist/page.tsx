'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useCart();

  if (!user) return null; // avoids rendering until redirect

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
      {wishlist.map((item) => (
        <div key={item.id} className='border p-4 rounded shadow relative'>
          <img
            src={item.imageUrl || '/placeholder.png'}
            alt={item.name}
            className='w-full h-40 object-cover mb-2 rounded'
          />
          <Link
            href={`/product/${item.id}`}
            className='text-blue-600 hover:underline font-medium'
          >
            <h2 className='font-semibold'>{item.name}</h2>
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
