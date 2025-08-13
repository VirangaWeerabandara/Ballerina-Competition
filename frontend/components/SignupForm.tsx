import React from 'react';
import { AppleIcon } from 'lucide-react';
import GoogleIcon from './icons/GoogleIcon';

export default function SignupForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="flex max-w-4xl rounded-2xl shadow-lg overflow-hidden">
        {/* Left side - form */}
        <div className="p-10 rounded-l-2xl w-[400px] flex flex-col justify-center" style={{ backgroundColor: '#FDF4EE' }}>
          <h2 className="text-2xl font-semibold mb-6">Get Started Now</h2>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F78149]"
            />
            <input
              type="email"
              placeholder="Email address"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F78149]"
            />
            <input
              type="password"
              placeholder="Password"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F78149]"
            />
            <label className="flex items-center text-xs text-gray-600">
              <input type="checkbox" className="mr-2" />
              I agree to the <a href="#" className="underline">terms & policy</a>
            </label>
            <button
              type="submit"
              className="text-white rounded-md py-2 text-sm font-semibold hover:bg-orange-500 transition"
              style={{ backgroundColor: '#F78149' }}
            >
              Signup
            </button>
          </form>
          <div className="my-4 text-center text-gray-400 text-xs">or</div>
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
              <GoogleIcon className="h-4 w-4" />
              <span>Sign in with Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.365 1.43c-1.14.05-2.5.77-3.3 1.7-.72.82-1.35 2.1-1.12 3.33 1.2.1 2.44-.7 3.2-1.6.7-.8 1.2-2.1 1.22-3.43zM20.5 7.5c-1.3-1.6-3.3-2.6-5.3-2.6-2.3 0-4.3 1.4-5.3 1.4-1.1 0-2.7-1.3-4.4-1.3-2.3 0-4.4 2.1-4.4 6.1 0 2.7 1.1 5.4 2.5 7.2 1.1 1.4 2.4 3 4.1 2.9 1.6-.1 2.2-1 4.1-1 1.9 0 3.1 1 4.1 1 1.7 0 2.8-1.4 3.8-2.8 1.2-1.7 1.7-3.3 1.7-3.4-.1-.1-3.3-1.3-3.3-5.1z"/>
              </svg>
              <span>Sign in with Apple</span>
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            Have an account?{' '}
            <a href="#" className="text-orange-400 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>

        {/* Right side - image */}
        <div className="w-[400px]">
          <img
            src="/signup.jpg"
            alt="Cozy chair"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
