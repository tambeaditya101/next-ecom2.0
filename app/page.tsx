import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-6'>Featured Products</h1>
        <ProductList />
      </div>
    </div>
  );
}
