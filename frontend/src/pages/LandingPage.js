import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../services/api';

const LandingPage = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  // Handle Auth0 callback → Skip auth and go directly to profile
  useEffect(() => {
    if (isAuthenticated && user) {
      // Directly navigate to profile without checking backend
      navigate('/profile');
    }
  }, [isAuthenticated, user, navigate]);

  // Theme bootstrap (same behaviour as the static HTML)
  useEffect(() => {
    const prefersDark =
      window.localStorage.theme === 'dark' ||
      (!('theme' in window.localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeLight = () => {
    document.documentElement.classList.remove('dark');
    window.localStorage.theme = 'light';
  };

  const handleThemeDark = () => {
    document.documentElement.classList.add('dark');
    window.localStorage.theme = 'dark';
  };

  // Simple splash behaviour
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Auth0 Universal Login (Google etc lives here)
    loginWithRedirect();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    loginWithRedirect({ screen_hint: 'signup' });
  };

  return (
    <div className="bg-white dark:bg-gray-900 flex items-center justify-center min-h-screen p-4 transition-colors duration-300">
      {/* Splash screen */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-700 ease-in-out">
          <h2 className="text-5xl md:text-7xl font-black text-center text-green-500 dark:text-green-400 p-4">
            Stop Scrolling.
            <br />
            Start Saving.
          </h2>
        </div>
      )}

      {/* Main content */}
      <div
        className={`w-full transition-opacity duration-500 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 flex space-x-2">
          <button
            type="button"
            onClick={handleThemeLight}
            className="p-2 rounded-full text-green-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {/* Sun icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleThemeDark}
            className="p-2 rounded-full text-gray-400 dark:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {/* Moon icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>

        {/* Centre card */}
        <div className="flex flex-col items-center space-y-8 text-center w-full max-w-sm mx-auto">
          <h1 className="text-7xl md:text-8xl font-black text-green-500 dark:text-green-400">
            Unplug.
          </h1>

          {/* Form – we ignore username/password and just use the button to trigger Auth0 */}
          <form onSubmit={handleLogin} className="w-full space-y-6 pt-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-400 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 shadow-lg shadow-green-500/20 dark:shadow-green-400/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-400 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 shadow-lg shadow-green-500/20 dark:shadow-green-400/30"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 dark:bg-green-400 text-white text-lg font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
              Continue with Google
            </button>
          </form>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-lg font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
