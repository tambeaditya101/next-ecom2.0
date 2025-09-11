// components/AuthForm.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        if (!form.email || !form.password) {
          throw new Error('Please fill in all fields');
        }
        if (login(form.email, form.password)) {
          router.push('/');
        } else {
          throw new Error('No user found with these credentials');
        }
      } else {
        signup(form.username, form.email, form.password);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow mt-6'>
      <h1 className='text-2xl font-bold mb-4'>
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      {error && <p className='text-red-500 mb-3'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {!isLogin && (
          <div>
            <label className='block mb-1 font-medium'>Username</label>
            <input
              type='text'
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>
        )}

        <div>
          <label className='block mb-1 font-medium'>Email</label>
          <input
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Password</label>
          <input
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p className='mt-4 text-sm text-gray-600 text-center'>
        {isLogin ? (
          <>
            Don’t have an account?{' '}
            <Link href='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-600 hover:underline'>
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
