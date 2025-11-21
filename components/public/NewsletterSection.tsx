'use client';

import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: Timestamp.now(),
        active: true,
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <section className="py-20 px-4 bg-blue-600 text-white" id="newsletter">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl mb-8">Get the Monthly Bru delivered to your inbox</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
          />
          <Button type="submit" disabled={status === 'loading'} variant="secondary">
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {status === 'success' && <p className="mt-4 text-green-200">Thanks for subscribing!</p>}
        {status === 'error' && <p className="mt-4 text-red-200">Something went wrong. Please try again.</p>}
      </div>
    </section>
  );
}
