'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart & wishlist whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.title === product.title);
      if (index !== -1) {
        return prev.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, message: `${product.title} added to cart!` },
    ]);
    setTimeout(() => removeToast(id), 2000);
  };

  // Remove product from cart
  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Update product quantity in cart
  const updateQuantity = (index: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  // Clear cart (checkout)
  const clearCart = (showToast = true) => {
    if (showToast) {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: 'Checkout successful!' }]);
      setTimeout(() => removeToast(id), 2000);
    }

    setCart([]);
    localStorage.removeItem('cart');
  };

  // Add/remove product to/from wishlist
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find((item) => item.title === product.title);
    const id = Date.now();

    if (exists) {
      setWishlist((prev) =>
        prev.filter((item) => item.title !== product.title)
      );
      setToasts((prev) => [
        ...prev,
        { id, message: `${product.title} removed from wishlist` },
      ]);
    } else {
      setWishlist((prev) => [...prev, product]);
      setToasts((prev) => [
        ...prev,
        { id, message: `${product.title} added to wishlist` },
      ]);
    }

    setTimeout(() => removeToast(id), 2000);
  };

  // Remove toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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
