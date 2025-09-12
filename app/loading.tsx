export default function Loading() {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className='flex flex-col items-center space-y-4'>
        {/* Spinner */}
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>

        {/* Text */}
        <p className='text-blue-600 font-medium text-lg'>Loading...</p>
      </div>
    </div>
  );
}
