'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/newsletters">Newsletters</Link>
        {user && <Link href="/admin">Admin</Link>}
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={signInWithGoogle}>Login with Google</button>
        )}
      </nav>
    </header>
  );
}
