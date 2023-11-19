// components/Footer.js
import Link from 'next/link';

function Footer() {
    return (
      <footer className="bg-gray-100">
    <section className="py-6 bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Join Our Community</h2> 
        <p className="text-gray-500 mb-4">Sign up for more</p>
        <Link href="/users/signup" passHref>
          <button className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 focus:ring focus:ring-emerald-200 focus:outline-none focus:ring-opacity-50">
            Sign Up
          </button> 
        </Link>
      </div>
    </section>
        <div className="container mx-auto p-4">
          <p className="text-center text-gray-500">
            &copy; 2023 Airbnb, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }
  
  export default Footer;
  