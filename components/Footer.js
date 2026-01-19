'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-accent-light dark:border-accent-dark">
      <div className="px-4 lg:px-10 py-12 flex justify-center">
        <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
            <Leaf className="text-primary text-3xl" size={32} />
            <h2 className="text-lg font-bold">AgriTrace</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light text-sm transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-right">
            <p>© 2024 AgriTrace. All rights reserved.</p>
            <p className="text-xs mt-1">Powered by Avalanche & IPFS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}