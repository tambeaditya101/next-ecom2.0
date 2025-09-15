'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductToolbar({
  categories,
}: {
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Whenever user updates filters → sync with URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('q', search);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    if (page > 1) params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  }, [search, sort, category, page]);

  return (
    <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between p-4 bg-gray-50 border rounded-xl shadow-sm mb-6'>
      {/* Search */}
      <input
        type='text'
        value={search}
        onChange={(e) => {
          setPage(1); // reset page on search
          setSearch(e.target.value);
        }}
        placeholder='Search products...'
        className='px-4 py-2 border rounded-lg flex-1'
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => {
          setPage(1);
          setCategory(e.target.value);
        }}
        className='px-3 py-2 border rounded-lg'
      >
        <option value=''>All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className='px-3 py-2 border rounded-lg'
      >
        <option value=''>Sort by</option>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
