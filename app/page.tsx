import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Welcome to Next.js 🚀</h2>
      <p className='text-gray-700'>
        This is a minimal setup with Next.js + Tailwind v3. Add pages in{' '}
        <code>/app</code> to learn routing.
      </p>
      <div>
        <h1 className='text-2xl font-bold mb-6'>Featured Products</h1>
        <ProductList />
      </div>
    </div>
  );
}
