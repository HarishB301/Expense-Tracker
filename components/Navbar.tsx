'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isSignedIn } = useUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className='sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-600/50 shadow-lg shadow-gray-900/5 dark:shadow-black/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105'
              onClick={closeMobileMenu}
            >
              <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white text-lg font-bold'>💰</span>
              </div>

              <span className='text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent'>
                ExpenseTracker AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className='hidden md:flex items-center space-x-2'>
            <Link
              href='/'
              className='px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition'
            >
              Home
            </Link>

            <Link
              href='/about'
              className='px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition'
            >
              About
            </Link>

            <Link
              href='/contact'
              className='px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition'
            >
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-2'>
            <ThemeToggle />

            {/* Auth */}
            {isSignedIn ? (
              <div className='p-1 rounded-xl bg-gradient-to-r from-emerald-100/50 to-green-100/50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200/30 dark:border-emerald-700/30'>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        'w-8 h-8 hover:scale-110 transition-transform',
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton mode='modal'>
                <button className='bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95'>
                  Sign In
                </button>
              </SignInButton>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className='md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition'
            >
              <svg
                className={`w-6 h-6 transition-transform ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className='mt-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg p-3 space-y-2'>
            <Link
              href='/'
              onClick={closeMobileMenu}
              className='block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            >
              🏠 Home
            </Link>

            <Link
              href='/about'
              onClick={closeMobileMenu}
              className='block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            >
              ℹ️ About
            </Link>

            <Link
              href='/contact'
              onClick={closeMobileMenu}
              className='block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            >
              📞 Contact
            </Link>

            {!isSignedIn && (
              <SignInButton mode='modal'>
                <button className='w-full mt-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-4 py-3 rounded-xl text-sm font-semibold'>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}