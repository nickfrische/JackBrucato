'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Newsletter } from '@/types';
import Link from 'next/link';

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    async function fetchNewsletters() {
      const q = query(
        collection(db, 'newsletters'),
        where('published', '==', true),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Newsletter[];
      setNewsletters(data);
    }
    fetchNewsletters();
  }, []);

  return (
    <div>
      <h1>Monthly Newsletters</h1>
      <div>
        {newsletters.map(newsletter => (
          <article key={newsletter.id}>
            <Link href={`/newsletters/${newsletter.id}`}>
              <h2>{newsletter.title}</h2>
              <p>{newsletter.date.toLocaleDateString()}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
