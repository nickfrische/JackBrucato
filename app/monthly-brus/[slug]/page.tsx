'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MonthlyBru } from '@/types';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

export default function MonthlyBruPostPage() {
  const params = useParams();
  const [bru, setBru] = useState<MonthlyBru | null>(null);

  useEffect(() => {
    async function fetchBru() {
      const q = query(
        collection(db, 'monthlyBrus'),
        where('slug', '==', params.slug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as MonthlyBru;
        setBru({ ...data, id: snapshot.docs[0].id });
        
        await updateDoc(doc(db, 'monthlyBrus', snapshot.docs[0].id), {
          'analytics.views': increment(1)
        });
      }
    }
    fetchBru();
  }, [params.slug]);

  if (!bru) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{bru.title}</h1>
          <div className="flex gap-4 text-gray-600 mb-4">
            <time>{format(bru.publishDate.toDate(), 'MMMM d, yyyy')}</time>
            <span>•</span>
            <span>{bru.readingTime} min read</span>
          </div>
          <div className="flex gap-2">
            {bru.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        </header>

        {bru.featuredImage.url && (
          <div className="mb-8">
            <img src={bru.featuredImage.url} alt={bru.featuredImage.alt} className="w-full rounded-lg shadow-lg" />
            {bru.featuredImage.caption && <figcaption className="text-center text-gray-600 mt-2">{bru.featuredImage.caption}</figcaption>}
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: bru.content }} />

        <footer className="border-t pt-8">
          <div className="flex items-center gap-4">
            {bru.author.photo && <img src={bru.author.photo} alt={bru.author.name} className="w-16 h-16 rounded-full" />}
            <div>
              <h3 className="font-bold text-lg">{bru.author.name}</h3>
              <p className="text-gray-600">{bru.author.bio}</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
