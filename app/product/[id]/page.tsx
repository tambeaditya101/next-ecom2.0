'use client';

import { Product, useCart } from '@/context/CartContext';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams() as { id: string };
  const numericId = Number(id);

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${numericId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Product not found');
        } else {
          setProduct(data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [numericId]);

  if (loading)
    return (
      <div className='p-6 text-center text-gray-500 text-lg font-semibold'>
        Loading...
      </div>
    );

  if (error || !product)
    return (
      <div className='p-6 text-center text-red-500 text-lg font-semibold'>
        {error || 'Product not found'}
      </div>
    );

  const isFavorite = wishlist.some((item) => item.id === product.id);

  return (
    <div
      className={`max-w-3xl mx-auto p-6 ${
        product.stock <= 0 ? 'opacity-50 pointer-events-none grayscale' : ''
      }`}
    >
      <div className='border rounded-xl shadow-md overflow-hidden'>
        {/* Product Image */}
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          className='w-full h-72 object-cover'
        />

        {/* Product Info */}
        <div className='p-6'>
          <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
          {product.description && (
            <p className='text-gray-600 mb-4'>{product.description}</p>
          )}
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
