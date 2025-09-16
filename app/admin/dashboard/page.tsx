'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

type AdminProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Raw products fetched from server
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for create / edit
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null
  );

  // --- UI controls for filtering / sorting / pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // fetch products (initial)
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products?all=true');
        const payload = await res.json();

        // support either { data: products } OR { data: { products, ... } }
        let fetched: AdminProduct[] = [];
        if (payload?.data?.products) fetched = payload.data.products;
        else if (Array.isArray(payload?.data)) fetched = payload.data;
        else fetched = payload?.data ?? [];

        if (mounted) setProducts(fetched);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // derive categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(String(p.category));
    });
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  // filtered + sorted products (memoized)
  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    let arr = products.slice();

    if (q) {
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      arr = arr.filter((p) => String(p.category) === categoryFilter);
    }

    arr.sort((a, b) => {
      let aVal: string | number = a[sortBy];
      let bVal: string | number = b[sortBy];

      // normalize strings
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [products, search, categoryFilter, sortBy, sortOrder]);

  // pagination math
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / itemsPerPage)
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSorted.slice(start, start + itemsPerPage);
  }, [filteredSorted, currentPage, itemsPerPage]);

  // helpers
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      imageUrl: '',
    });
    setEditingProduct(null);
  };

  // create / update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock || '0', 10),
      category: form.category || null,
      imageUrl: form.imageUrl || null,
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || 'Failed to save product');
        return;
      }

      // server returns created/updated product in data.data — handle both shapes
      const saved = data?.data?.product ?? data?.data ?? data;
      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        toast.success('Product updated successfully!');
      } else {
        setProducts((prev) => [saved, ...prev]);
        toast.success('Product created successfully!');
      }

      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || 'Failed to delete');
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  if (loading) return <p className='text-center mt-10'>Loading...</p>;

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar (fixed) */}
      <aside className='fixed left-0 top-15 w-64 h-[calc(100vh-50px)] bg-gray-900 text-white flex flex-col'>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-6'>Admin</h2>
          {/* <nav className='flex flex-col gap-2'>
            <Button
              variant='secondary'
              onClick={() => router.push('/admin/dashboard')}
              className='bg-gray-700 text-white'
              disabled
            >
              Products
            </Button>
          </nav> */}
          <nav className='flex flex-col gap-2'>
            <Button
              variant='secondary'
              onClick={() => router.push('/admin/dashboard')}
              className='bg-gray-700 text-white'
              disabled
            >
              Products
            </Button>
            <Button
              variant='ghost'
              onClick={() => router.push('/admin/orders')}
            >
              Orders
            </Button>
            <Button variant='ghost' onClick={() => router.push('/admin/users')}>
              Users
            </Button>
            <Button
              variant='ghost'
              onClick={() => router.push('/admin/settings')}
            >
              Settings
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 ml-64 mt-14 p-6 bg-gray-50 overflow-y-auto'>
        <div className='flex items-center justify-between mb-6 gap-4'>
          <h1 className='text-2xl font-bold'>Manage Products</h1>

          {/* Add / Edit Dialog */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type='number'
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      type='number'
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                  />
                </div>

                <Button type='submit' className='w-full'>
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Toolbar: Search / Category / Sort / ItemsPerPage */}
        <div className='flex flex-wrap gap-3 items-center mb-6'>
          <Input
            placeholder='Search by name / category / description'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className='max-w-md'
          />

          <select
            className='border rounded px-3 py-2'
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>

          <select
            className='border rounded px-3 py-2'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value='name'>Sort by name</option>
            <option value='price'>Sort by price</option>
            <option value='stock'>Sort by stock</option>
          </select>

          <Button
            variant='outline'
            onClick={() => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))}
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </Button>

          <select
            className='border rounded px-3 py-2 ml-auto'
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={6}>6 / page</option>
            <option value={9}>9 / page</option>
            <option value={12}>12 / page</option>
          </select>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {paginated.length === 0 ? (
            <div className='col-span-full text-center py-12 text-gray-600'>
              No products found.
            </div>
          ) : (
            paginated.map((product) => (
              <Card key={product.id}>
                <CardContent className='p-4'>
                  <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className='w-full h-40 object-cover rounded-md mb-4'
                  />
                  <h2 className='font-semibold'>{product.name}</h2>
                  <p className='text-gray-600'>₹{product.price}</p>
                  <p className='text-sm text-gray-500'>
                    Stock: {product.stock}
                  </p>
                  <div className='flex gap-2 mt-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setEditingProduct(product);
                        setForm({
                          name: product.name,
                          description: product.description ?? '',
                          price: String(product.price),
                          stock: String(product.stock),
                          category: product.category ?? '',
                          imageUrl: product.imageUrl ?? '',
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-center gap-2 mt-6'>
          <Button
            variant='outline'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>

          {/* page numbers */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            variant='outline'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
