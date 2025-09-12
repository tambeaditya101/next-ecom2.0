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

  const isLogin = mode === 'login';
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'customer',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        if (!form.email || !form.password)
          throw new Error('Please fill all fields');
        const success = await login(form.email, form.password);
        if (success) router.push('/');
      } else {
        if (
          !form.email ||
          !form.password ||
          !form.username ||
          !form.confirmPassword
        ) {
          throw new Error('Please fill all fields');
        }
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const success = await signup(
          form.email,
          form.password,
          form.username,
          form.role
        );
        if (success) router.push('/');
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
          <>
            <div>
              <label className='block mb-1 font-medium'>
                Username <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className='w-full border px-3 py-2 rounded'
              />
            </div>

            <div>
              <label className='block mb-1 font-medium'>Role</label>
              <div className='flex items-center gap-3'>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='role'
                    value='customer'
                    checked={form.role === 'customer'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className='mr-2'
                  />
                  Customer
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='role'
                    value='admin'
                    checked={form.role === 'admin'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className='mr-2'
                  />
                  Admin
                </label>
              </div>
            </div>
          </>
        )}

        <div>
          <label className='block mb-1 font-medium'>
            Email <span className='text-red-500'>*</span>
          </label>
          <input
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>
            Password <span className='text-red-500'>*</span>
          </label>
          <input
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        {!isLogin && (
          <div>
            <label className='block mb-1 font-medium'>
              Confirm Password <span className='text-red-500'>*</span>
            </label>
            <input
              type='password'
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>
        )}

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
