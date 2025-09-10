'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Product = {
  title: string;
  price: number;
  image: string;
};

type CartItem = Product & { quantity: number };

type Toast = {
  id: number;
  message: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  toasts: Toast[];
  removeToast: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.title === product.title);
      if (index !== -1) {
        return prevCart.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Add toast
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, message: `${product.title} added to cart!` },
    ]);
    setTimeout(() => removeToast(id), 2000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const clearCart = () => {
    // Create checkout success toast
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: 'Checkout successful!' }]);

    // Remove toast after 2 seconds
    setTimeout(() => removeToast(id), 2000);

    // Clear cart after a short delay (50ms) so toast renders
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('cart');
    }, 50);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toasts,
        removeToast,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
