type ProductCardProps = {
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
};

export default function ProductCard({
  title,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className='border rounded-xl shadow-md p-4 w-64'>
      <img
        src={image}
        alt={title}
        className='w-full h-40 object-cover rounded-md mb-3'
      />
      <h2 className='text-lg font-semibold'>{title}</h2>
      <p className='text-gray-600'>₹{price}</p>
      <button
        onClick={onAddToCart}
        className='mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
      >
        Add to Cart
      </button>
    </div>
  );
}
