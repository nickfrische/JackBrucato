'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MonthlyBru } from '@/types';
import BruCard from '@/components/public/BruCard';

export default function MonthlyBrusPage() {
  const [brus, setBrus] = useState<MonthlyBru[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBrus() {
      const q = query(
        collection(db, 'monthlyBrus'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MonthlyBru[];
      setBrus(data);
    }
    fetchBrus();
  }, []);

  const filteredBrus = brus.filter(bru =>
    bru.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bru.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4">The Monthly Bru Archive</h1>
          <p className="text-xl text-gray-600 text-center mb-8">Insights and analysis on business, leadership, and growth</p>
          
          <input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredBrus.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrus.map(bru => (
                <BruCard key={bru.id} bru={bru} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No posts found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
