'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Leaf } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Farmer', href: '/login/farmer' },
    { name: 'Distributor', href: '/login/distributor' },
    { name: 'Retailer', href: '/login/retailer' },
    { name: 'Scan Product', href: '/scan' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="px-4 lg:px-10 flex flex-1 justify-center">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-accent-light dark:border-accent-dark w-full max-w-7xl px-4 lg:px-10 py-3">
          <Link href="/" className="flex items-center gap-3 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity">
            <Leaf className="text-primary text-3xl" size={32} />
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">AgriTrace</h2>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-text-light dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button 
              onClick={() => router.push('/login/farmer')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
            >
              <span className="truncate">Login</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent-light dark:hover:bg-accent-dark"
            >
              {isMenuOpen ? (
                <X className="text-text-light dark:text-text-dark" size={24} />
              ) : (
                <Menu className="text-text-light dark:text-text-dark" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background-light dark:bg-background-dark border-b border-accent-light dark:border-accent-dark">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-text-light dark:text-slate-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                router.push('/login/farmer');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}