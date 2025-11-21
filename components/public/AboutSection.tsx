'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteContent } from '@/types';

export default function AboutSection() {
  const [content, setContent] = useState<SiteContent['about'] | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().about as SiteContent['about']);
      } else {
        setContent({ content: '<h2>About Me</h2><p>Welcome! Edit this content in the admin panel.</p>', image: '' });
      }
    }
    fetchContent();
  }, []);

  if (!content) return null;

  return (
    <section className="py-20 px-4 bg-white" id="about">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: content.content }} />
        <div>
          {content.image && <img src={content.image} alt="About" className="rounded-lg shadow-lg w-full" />}
        </div>
      </div>
    </section>
  );
}
