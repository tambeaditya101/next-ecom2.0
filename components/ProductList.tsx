'use client';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import products from '../data/products.json';

export default function HomePage() {
  const { addToCart, toasts } = useCart();

  return (
    <div className='relative'>
      {/* Stackable Toasts */}
      <div className='fixed top-16 right-4 flex flex-col gap-2 z-50'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className='bg-green-500 text-white px-4 py-2 rounded shadow transform transition-all duration-300 opacity-100 translate-y-0'
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className='flex gap-6 flex-wrap p-4 mt-4'>
        {products.map((product, index) => (
          <ProductCard
            key={index}
            title={product.title}
            price={product.price}
            image={product.image}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}
