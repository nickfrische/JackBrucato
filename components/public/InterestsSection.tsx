'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteContent } from '@/types';
import Card from '@/components/shared/Card';

export default function InterestsSection() {
  const [content, setContent] = useState<SiteContent['interests'] | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().interests as SiteContent['interests']);
      }
    }
    fetchContent();
  }, []);

  if (!content) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section className="py-20 px-4 bg-gray-50" id="interests">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Books, Podcasts & More</h2>
        
        {content.books.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Books</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {content.books.map((book, idx) => (
                <Card key={idx}>
                  {book.cover && <img src={book.cover} alt={book.title} className="w-full h-64 object-cover rounded mb-4" />}
                  <h4 className="font-bold text-lg mb-2">{book.title}</h4>
                  <p className="text-gray-600 mb-4">{book.author}</p>
                  <a href={book.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                </Card>
              ))}
            </div>
          </div>
        )}

        {content.podcasts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Podcasts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {content.podcasts.map((podcast, idx) => (
                <Card key={idx}>
                  <h4 className="font-bold text-lg mb-2">{podcast.name}</h4>
                  <p className="text-gray-500 mb-2">{podcast.host}</p>
                  <p className="text-gray-600 mb-4">{podcast.description}</p>
                  <a href={podcast.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Listen</a>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
