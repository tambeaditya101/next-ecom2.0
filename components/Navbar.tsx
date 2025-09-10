'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();

  // Avoid SSR mismatch: only show counts after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const uniqueCartItems = mounted ? cart.length : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
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

  return (
    <nav className='bg-blue-600 text-white text-lg px-6 py-3 flex items-center justify-between relative'>
      <h1 className='text-lg font-bold'>NextLearn</h1>
      <div className='flex space-x-6 relative'>
        {links.map((link) => {
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
                    className={`
                      absolute -top-2 -right-4 text-white text-xs font-bold rounded-full w-5 h-5 
                      flex items-center justify-center ${link.badgeColor}
                    `}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
              <span
                className={`
                  absolute left-0 -bottom-1 h-0.5 bg-yellow-300 transition-all duration-300
                  ${isActive ? 'w-full' : 'w-0'}
                `}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
