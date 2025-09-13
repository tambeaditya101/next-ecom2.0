'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) setProducts(data.data);
        else toast.error(data.message || 'Failed to load products');
      } catch (err) {
        console.error(err);
        toast.error('Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  if (loading) return <p className='text-center mt-10'>Loading...</p>;

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <aside className='w-64 bg-gray-900 text-white p-4'>
        <h2 className='text-xl font-bold mb-6'>Admin Dashboard</h2>
        <nav className='flex flex-col gap-2'>
          <Button
            variant='secondary'
            onClick={() => router.push('/admin/dashboard')}
          >
            Products
          </Button>
        </nav>
        <div className='mt-auto'>
          <Button
            variant='destructive'
            onClick={logout}
            className='w-full mt-6'
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-6 bg-gray-50'>
        <h1 className='text-2xl font-bold mb-6'>Manage Products</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className='p-4'>
                <img
                  src={product.imageUrl || '/placeholder.png'}
                  alt={product.name}
                  className='w-full h-40 object-cover rounded-md mb-4'
                />
                <h2 className='font-semibold'>{product.name}</h2>
                <p className='text-gray-600'>₹{product.price}</p>
                <p className='text-sm text-gray-500'>Stock: {product.stock}</p>
                <div className='flex gap-2 mt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => toast('Edit feature coming soon')}
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
          ))}
        </div>
      </main>
    </div>
  );
}
