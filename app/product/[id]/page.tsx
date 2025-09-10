'use client';

import { useCart } from '@/context/CartContext';
import products from '@/data/products.json';
import { useParams } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams() as { id: string };
  const numericId = Number(id);

  const product = products.find((p) => Number(p.id) === numericId);
  const { addToCart, wishlist, toggleWishlist } = useCart();

  if (!product) {
    return (
      <div className='p-6 text-center text-red-500 text-lg font-semibold'>
        Product not found
      </div>
    );
  }

  const isFavorite = wishlist.some((item) => item.id === product.id);

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='border rounded-xl shadow-md overflow-hidden'>
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className='w-full h-72 object-cover'
        />

        {/* Product Info */}
        <div className='p-6'>
          <h1 className='text-3xl font-bold mb-2'>{product.title}</h1>
          <p className='text-gray-600 mb-4'>{product?.description}</p>
          <p className='text-2xl font-semibold text-blue-700 mb-6'>
            ₹{product.price}
          </p>

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => addToCart(product)}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
            >
              Add to Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className='text-red-500 text-2xl'
              aria-label='Toggle Wishlist'
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
