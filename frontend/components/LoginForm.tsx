import React from 'react';

export default function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="flex max-w-4xl rounded-2xl shadow-lg overflow-hidden">
        {/* Left side - form */}
        <div className="p-10 rounded-l-2xl w-[400px] flex flex-col justify-center" style={{ backgroundColor: '#FDF4EE' }}>
          <h2 className="text-2xl font-semibold mb-1">Welcome back!</h2>
          <p className="text-sm text-gray-600 mb-6">Enter your Credentials to access your account</p>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F78149]"
            />
            <div className="flex justify-between items-center text-xs text-gray-600">
              <input
                type="password"
                placeholder="Password"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F78149] w-full"
              />
              <a href="#" className="ml-4 text-orange-400 hover:underline whitespace-nowrap">
                forgot password
              </a>
            </div>
            <label className="flex items-center text-xs text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember for 30 days
            </label>
            <button
              type="submit"
              className="text-white rounded-md py-2 text-sm font-semibold hover:bg-orange-500 transition"
              style={{ backgroundColor: '#F78149' }}
            >
              Login
            </button>
          </form>
          <div className="my-4 text-center text-gray-400 text-xs">or</div>
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
              <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.5h146.9c-6.3 34-25.4 62.8-54.3 82v68h87.7c51.3-47.3 80.2-116.7 80.2-195.1z"/>
                <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.1l-87.7-68c-24.3 16.3-55.4 25.9-93.1 25.9-71.5 0-132-48.3-153.6-113.1H28.1v70.9C73.1 485.7 165.4 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M118.4 323.9c-5.4-16.3-8.5-33.7-8.5-51.5s3.1-35.2 8.5-51.5v-70.9H28.1c-17.7 34.9-28 74.1-28 116.4s10.3 81.5 28 116.4l90.3-70.9z"/>
                <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C405.7 24.6 344 0 272 0 165.4 0 73.1 58.6 28.1 147.4l90.3 70.9c21.6-64.8 82.1-113.1 153.6-113.1z"/>
              </svg>
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
            Don&apos;t have an account?{' '}
            <a href="#" className="text-orange-400 font-semibold hover:underline">
              Sign Up
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
