'use client';

import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import ProductCard from './ProductCard';
import ProductToolbar from './ProductToolbar';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, toasts } = useCart();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const getProducts = async () => {
    try {
      const res = await fetch(
        `/api/products?q=${q}&sort=${sort}&category=${category}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setProducts(data.data.products);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      // return data.data; // array of categories
      setCategories(data.data);
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  useEffect(() => {
    getProducts();
  }, [q, sort, category, page]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className='relative'>
      <ProductToolbar categories={categories} />
      {/* Toasts */}
      <div className='fixed top-16 right-4 flex flex-col gap-2 z-50'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className='bg-green-500 text-white px-4 py-2 rounded shadow'
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
            product={product}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
