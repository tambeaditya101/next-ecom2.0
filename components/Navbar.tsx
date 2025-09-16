'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist } = useCart();
  const { user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const uniqueCartItems = mounted ? cart.length : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

  // ✅ Primary navigation
  const navLinks = [
    { href: '/', label: 'Home' },
    {
      href: '/cart',
      label: 'Cart',
      badge: uniqueCartItems,
      badgeColor: 'bg-red-500',
    },
    {
      href: '/wishlist',
      label: 'Wishlist',
      badge: wishlistCount,
      badgeColor: 'bg-yellow-500',
    },
  ];

  // ✅ Informational / secondary
  const infoLinks = [{ href: '/about', label: 'About' }];

  const renderLink = (link: any) => {
    const isActive = pathname === link.href;
    return (
      <div key={link.href} className='relative'>
        <Link
          href={link.href}
          className='relative px-1 py-1 transition-colors duration-300 ease-in-out'
        >
          {link.label}
          {(link.badge ?? 0) > 0 && (
            <span
              className={`absolute -top-2 -right-4 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${link.badgeColor}`}
            >
              {link.badge}
            </span>
          )}
        </Link>
        <span
          className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-300 transition-all duration-300 ${
            isActive ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    );
  };

  return (
    <nav className='bg-blue-600 text-white text-lg px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md'>
      {/* Logo */}
      <h1 className='text-lg font-bold'>NextLearn Store</h1>

      {/* Navigation */}
      <div className='flex items-center space-x-6 relative'>
        {/* Main Links */}
        {navLinks.map(renderLink)}

        {/* Info Links (About etc.) */}
        {infoLinks.map(renderLink)}

        {/* 🔑 Auth Section */}
        {!user ? (
          renderLink({ href: '/login', label: 'Login' })
        ) : (
          <div className='flex items-center space-x-4'>
            {/* Admin Only */}
            {user.role === 'admin' && (
              <Link
                href='/admin/dashboard'
                className={`bg-yellow-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-yellow-600 transition duration-300 ease-in-out ${
                  pathname.startsWith('/admin')
                    ? 'font-bold ring-2 ring-yellow-300'
                    : ''
                }`}
              >
                Admin Panel
              </Link>
            )}

            {/* Profile */}
            <Link href='/profile' className='hover:opacity-80'>
              <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
                <User className='w-5 h-5 text-blue-600' />
              </div>
            </Link>

            {/* Logout with Confirmation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className='bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-300'>
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                </DialogHeader>
                <DialogFooter className='flex justify-end gap-2'>
                  <Button variant='outline'>Cancel</Button>
                  <Button
                    variant='destructive'
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                  >
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </nav>
  );
}
