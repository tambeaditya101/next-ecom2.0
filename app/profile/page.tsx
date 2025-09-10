// app/profile/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  if (!user) return null;

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <p className='mb-2'>
        <span className='font-semibold'>Username:</span> {user.username}
      </p>
      <p className='mb-2'>
        <span className='font-semibold'>Email:</span> {user.email}
      </p>

      <div className='mt-6 border-t pt-4'>
        <h2 className='text-lg font-semibold mb-2'>Order History</h2>
        <p className='text-gray-600'>No orders yet.</p>
      </div>
    </div>
  );
}
