'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/unauthorized');
    }
  }, [user, loading]);

  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05); // 5% dummy tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
          Your cart is empty 🛒
        </h2>
        <p className='text-gray-500 mb-6'>
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition'
        >
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  const hasOutOfStock = cart.some((item) => item.stock <= 0);

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Cart Items */}
        <div className='md:col-span-2 flex flex-col gap-4'>
          {cart.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between bg-gray-100 p-4 rounded'
            >
              <div className='flex items-center gap-4'>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className='w-16 h-16 object-cover rounded'
                />
                <div>
                  <Link
                    href={`/product/${item.id}`}
                    className='text-blue-600 hover:underline font-medium'
                  >
                    <h2 className='font-semibold'>{item.name}</h2>
                  </Link>
                  <p>₹{item.price}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <button
                  className='px-2 bg-gray-300 rounded'
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className='px-2 bg-gray-300 rounded'
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className='px-3 py-1 bg-red-500 text-white rounded'
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className='bg-white border rounded-lg shadow-md p-6 h-fit'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
          <div className='flex justify-between mb-2'>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span>Tax (5%)</span>
            <span>₹{tax}</span>
          </div>
          <div className='flex justify-between text-lg font-semibold border-t pt-2'>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            className='w-full mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700'
            onClick={() => router.push('/checkout')}
            disabled={hasOutOfStock}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
