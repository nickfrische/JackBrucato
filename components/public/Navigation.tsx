'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
          <Link href="/monthly-brus" className="text-gray-700 hover:text-blue-600 font-medium transition">Archive</Link>
          {user && <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition">Admin</Link>}
        </div>
        {user ? (
          <button onClick={logout} className="text-gray-700 hover:text-blue-600 font-medium transition">Logout</button>
        ) : (
          <button onClick={signInWithGoogle} className="text-gray-700 hover:text-blue-600 font-medium transition">Admin Login</button>
        )}
      </div>
    </nav>
  );
}
