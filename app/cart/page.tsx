'use client';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className='p-6 text-center'>
        <h2 className='text-xl font-bold mb-4'>Your cart is empty</h2>
        <p>Add some products</p>
        <div className='m-4'>
          <Link
            href='/'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>

      <div className='flex flex-col gap-4'>
        {cart.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between bg-gray-100 p-4 rounded'
          >
            <div className='flex items-center gap-4'>
              <img
                src={item.image}
                alt={item.title}
                className='w-16 h-16 object-cover rounded'
              />
              <div>
                <h2 className='font-semibold'>{item.title}</h2>
                <p>Price: ₹{item.price}</p>
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

      <div className='mt-6 flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Total: ₹{totalPrice}</h2>
        <button
          className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'
          onClick={clearCart}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
