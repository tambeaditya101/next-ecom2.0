'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useCart();

  if (wishlist.length === 0)
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
          Your wishlist is empty 💔
        </h2>
        <p className='text-gray-500 mb-6'>
          Save items you love to find them easily later.
        </p>
        <Link
          href='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition'
        >
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        Your Wishlist ❤️
      </h1>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {wishlist.map((item) => (
          <div
            key={item.id}
            className='relative bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden'
          >
            {/* Remove button */}
            <button
              onClick={() => toggleWishlist(item)}
              className='absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-red-100 transition'
              aria-label='Remove from wishlist'
            >
              <X className='w-5 h-5 text-red-600' />
            </button>

            {/* Product Image */}
            <img
              src={item.imageUrl || '/placeholder.png'}
              alt={item.name}
              className='w-full h-48 object-cover'
            />

            {/* Product Details */}
            <div className='p-4 flex flex-col gap-2'>
              <Link
                href={`/product/${item.id}`}
                className='text-lg font-semibold text-gray-900 hover:text-blue-600 transition'
              >
                {item.name}
              </Link>
              <p className='text-gray-600'>₹{item.price}</p>
              <Link
                href={`/product/${item.id}`}
                className='mt-2 inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
