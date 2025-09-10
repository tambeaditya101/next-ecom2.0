import { Product, useCart } from '@/context/CartContext';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

type ProductCardProps = {
  product: Product; // the full product object
  onAddToCart?: () => void; // optional, you can call addToCart directly too
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isFavorite = wishlist.some((item) => item.title === product.title);

  return (
    <div className='relative border rounded-xl shadow-md p-4 w-64'>
      <Link href={`/product/${product.id}`} className='z-10'>
        <img
          src={product.image}
          alt={product.title}
          className='w-full h-40 object-cover rounded-md mb-3'
        />
        <h2 className='text-lg font-semibold'>{product.title}</h2>
        <p className='text-gray-600'>₹{product.price}</p>
      </Link>

      {/* Add to cart */}
      <button
        onClick={onAddToCart ? onAddToCart : () => addToCart(product)}
        className='mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
      >
        Add to Cart
      </button>

      {/* Wishlist heart */}
      <button
        className='absolute top-2 right-2 text-red-500 text-lg'
        onClick={() => {
          toggleWishlist(product);
        }}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
}
