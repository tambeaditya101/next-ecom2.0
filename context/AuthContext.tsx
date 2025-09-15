'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from './CartContext';

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
};

type AuthResult = {
  success: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (
    email: string,
    password: string,
    username: string,
    role: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setUser(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.data) {
        setUser(data.data.user);
        return { success: true, message: data.message || 'Login successful' };
      }

      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server error' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    role: string
  ): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, role }),
      });
      const data = await res.json();

      if (res.ok && data.data) {
        setUser(data.data.user);
        return { success: true, message: data.message || 'Signup successful' };
      }

      return { success: false, message: data.message || 'Signup failed' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server error' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    clearCart();

    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
