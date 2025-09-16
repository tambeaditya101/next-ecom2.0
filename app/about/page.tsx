export default function AboutPage() {
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>About This Project</h1>

      {/* Overview */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>📌 Overview</h2>
        <p className='text-gray-700 leading-relaxed'>
          <span className='font-semibold'>NextLearn Store</span> is a full-stack
          e-commerce application built as part of my portfolio to demonstrate
          practical skills in modern web development. It covers both
          customer-facing features (browsing, cart, wishlist, checkout) and an
          admin dashboard for product management.
        </p>
      </section>

      {/* Learning Journey */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>💡 Learning Journey</h2>
        <p className='text-gray-700 leading-relaxed mb-2'>
          This is my first project using{' '}
          <span className='font-semibold'>Next.js</span>. I built it as a
          hands-on way to understand the App Router, Route Handlers, Middleware,
          and server-side rendering.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          While it started as a learning project, I challenged myself to
          implement <span className='font-semibold'>real-world features</span>{' '}
          like authentication, admin dashboards, pagination, and JWT-based route
          protection—going beyond a simple tutorial. This helped me gain
          confidence in building production-style applications.
        </p>
      </section>

      {/* Problem & Solution */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>🚀 Problem & Solution</h2>
        <p className='text-gray-700 leading-relaxed mb-2'>
          Many tutorials only focus on isolated features like authentication or
          routing. I wanted to build a{' '}
          <span className='font-semibold'>real-world application</span> that
          combines all these concepts into a complete, production-style project.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          This project solves that by implementing an end-to-end store with
          authentication, product management, and user interactions—all in one
          place.
        </p>
      </section>

      {/* Key Features */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>✨ Key Features</h2>
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>🔐 JWT-based authentication & protected routes</li>
          <li>🛒 Cart, wishlist, and checkout flow</li>
          <li>📦 Admin dashboard for product CRUD</li>
          <li>📱 Responsive UI with Tailwind CSS</li>
          <li>⚡ Server-side pagination, sorting, and filtering</li>
          <li>🗄️ Database with Prisma + PostgreSQL</li>
        </ul>
      </section>

      {/* Tech Stack */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>🛠 Tech Stack</h2>
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>Next.js 14 (App Router + Route Handlers + Middleware)</li>
          <li>React + Context API</li>
          <li>Prisma ORM + PostgreSQL</li>
          <li>Tailwind CSS</li>
          <li>JWT Authentication</li>
        </ul>
      </section>

      {/* Source Code */}
      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>📂 Source Code</h2>
        <p className='text-gray-700'>
          The complete project is available on{' '}
          <a
            href='https://github.com/tambeaditya101/next-ecom2.0'
            className='text-blue-600 hover:underline'
            target='_blank'
          >
            GitHub
          </a>
          . Feel free to explore the code, raise issues, or contribute.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className='text-xl font-semibold mb-2'>📬 Contact</h2>
        <p className='text-gray-700'>
          If you’d like to connect, you can reach me via{' '}
          <a
            href='mailto:tambeaditya101@gmail.com'
            className='text-blue-600 hover:underline'
          >
            email
          </a>{' '}
          or{' '}
          <a
            href='https://www.linkedin.com/in/tambeaditya/'
            className='text-blue-600 hover:underline'
            target='_blank'
          >
            LinkedIn
          </a>
          .
        </p>
      </section>
    </div>
  );
}
