'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MonthlyBru } from '@/types';
import Button from '@/components/shared/Button';
import Link from 'next/link';

export default function MonthlyBruSection() {
  const [latestBru, setLatestBru] = useState<MonthlyBru | null>(null);

  useEffect(() => {
    async function fetchLatest() {
      const q = query(
        collection(db, 'monthlyBrus'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as MonthlyBru;
        setLatestBru({ ...data, id: snapshot.docs[0].id });
      }
    }
    fetchLatest();
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-50" id="monthly-bru">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">The Monthly Bru</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Monthly insights on business, leadership, and growth</p>
        
        {latestBru ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
            {latestBru.featuredImage.url && (
              <img src={latestBru.featuredImage.url} alt={latestBru.featuredImage.alt} className="w-full h-64 object-cover" />
            )}
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-4">{latestBru.title}</h3>
              <p className="text-gray-600 mb-6">{latestBru.excerpt}</p>
              <div className="flex gap-4">
                <Link href={`/monthly-brus/${latestBru.slug}`}>
                  <Button>Read the Latest Issue</Button>
                </Link>
                <Link href="/monthly-brus">
                  <Button variant="secondary">View Archive</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">No published issues yet. Check back soon!</p>
            <Link href="/monthly-brus">
              <Button variant="secondary">View Archive</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
