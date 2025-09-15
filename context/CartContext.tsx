'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Backend Product type
export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
  category?: string;
};

export type CartItem = Product & { quantity: number };
export type WishlistItem = Product;
export type Toast = { id: number; message: string };

type CartContextType = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toasts: Toast[];
  removeToast: (id: number) => void;
  clearWishlist: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load cart & wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 2000);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === product.id);

      if (index !== -1) {
        if (prev[index].quantity + 1 > product.stock) {
          showToast(`Only ${product.stock} items available`);
          return prev;
        }
        return prev.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      if (product.stock < 1) {
        showToast('Product is out of stock');
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    showToast(`${product.name} added to cart!`);
  };

  // Remove product from cart
  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Update product quantity in cart
  const updateQuantity = (index: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Wishlist toggle
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`${product.name} removed from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`${product.name} added to wishlist`);
    }
  };

  // Remove toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        toggleWishlist,
        removeFromCart,
        updateQuantity,
        clearCart,
        toasts,
        removeToast,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
