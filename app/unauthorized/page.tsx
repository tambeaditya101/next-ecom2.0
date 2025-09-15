export default function UnauthorizedPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
      <h1 className='text-3xl font-bold text-red-600 mb-4'>Unauthorized</h1>
      <p className='text-gray-700 mb-6'>
        You must be logged in to access this page.
      </p>
      <a
        href='/login'
        className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
      >
        Go to Login
      </a>
    </div>
  );
}
