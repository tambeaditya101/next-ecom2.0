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
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) setProducts(data.data.products);
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

  // create / update handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (editingProduct) {
          // update existing
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.data : p))
          );
          toast.success('Product updated successfully!');
        } else {
          // add new
          setProducts((prev) => [data.data, ...prev]);
          toast.success('Product created successfully!');
        }
        resetForm();
        setOpen(false);
      } else {
        toast.error(data.message || 'Failed to save product');
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
      <aside className='fixed left-0 top-15 w-64 h-[calc(100vh-56px)] bg-gray-900 text-white flex flex-col'>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-6'>Admin Dashboard</h2>
          <nav className='flex flex-col gap-2'>
            <Button
              variant='secondary'
              onClick={() => router.push('/admin/dashboard')}
            >
              Products
            </Button>
          </nav>
        </div>

        {/* pinned bottom */}
        {/* <div className='p-4 mt-auto'>
          <Button variant='destructive' onClick={logout} className='w-full'>
            Logout
          </Button>
        </div> */}
      </aside>

      {/* Main content */}
      <main className='flex-1 ml-64 mt-14 p-6 bg-gray-50 overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Manage Products</h1>

          {/* Add / Edit Product Dialog */}
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) resetForm(); // reset when closed
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>Add Product</Button>
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

        {/* Products grid */}
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
                    onClick={() => {
                      setEditingProduct(product);
                      setForm({
                        name: product.name,
                        description: product.description,
                        price: String(product.price),
                        stock: String(product.stock),
                        category: product.category || '',
                        imageUrl: product.imageUrl || '',
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
          ))}
        </div>
      </main>
    </div>
  );
}
