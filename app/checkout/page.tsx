'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!user) {
      alert('Please log in to place an order.');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          userId: user.id, // 👈 make sure your AuthContext provides `user.id`
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      console.log('✅ Order placed:', data);

      clearCart(); // remove local cart after successful checkout
      router.push('/order-success');
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className='p-6 text-center'>
        <h2 className='text-xl font-bold mb-4'>No items to checkout</h2>
        <Link
          href='/'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className='grid md:grid-cols-2 gap-6 bg-white border rounded-lg shadow-md p-6'
      >
        {/* --- Left: Customer Info --- */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold mb-2'>Customer Info</h2>

          <input
            type='text'
            name='name'
            placeholder='Full Name *'
            value={form.name}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='email'
            name='email'
            placeholder='Email *'
            value={form.email}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='tel'
            name='phone'
            placeholder='Phone'
            value={form.phone}
            onChange={handleChange}
            className='w-full border p-2 rounded'
          />

          <input
            type='text'
            name='address'
            placeholder='Address *'
            value={form.address}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />

          <div className='flex gap-4'>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={form.city}
              onChange={handleChange}
              className='flex-1 border p-2 rounded'
            />
            <input
              type='text'
              name='zip'
              placeholder='ZIP Code'
              value={form.zip}
              onChange={handleChange}
              className='w-32 border p-2 rounded'
            />
          </div>
        </div>

        {/* --- Right: Order Summary --- */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Order Summary</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className='flex justify-between items-center border-b py-2'
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className='flex justify-between mt-4'>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className='flex justify-between'>
            <span>Tax (5%)</span>
            <span>₹{tax}</span>
          </div>
          <div className='flex justify-between text-lg font-bold border-t pt-2 mt-2'>
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full mt-6 px-6 py-2 rounded text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
