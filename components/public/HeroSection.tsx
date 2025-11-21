'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteContent } from '@/types';
import Button from '@/components/shared/Button';

export default function HeroSection() {
  const [content, setContent] = useState<SiteContent['hero'] | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().hero as SiteContent['hero']);
      } else {
        setContent({
          heading: 'Jack Brucato',
          subheading: 'Author of The Monthly Bru',
          headshotUrl: '',
          ctaButtons: [
            { text: 'Read Latest Bru', link: '/monthly-brus' },
            { text: 'View Portfolio', link: '#portfolio' }
          ]
        });
      }
    }
    fetchContent();
  }, []);

  if (!content) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="mb-8">
        {content.headshotUrl && <img src={content.headshotUrl} alt="Jack Brucato" className="w-48 h-48 rounded-full object-cover shadow-lg" />}
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">{content.heading}</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 text-center max-w-2xl">{content.subheading}</p>
      <div className="flex gap-4">
        {content.ctaButtons.map((btn, idx) => (
          <Button key={idx} onClick={() => window.location.href = btn.link}>
            {btn.text}
          </Button>
        ))}
      </div>
    </section>
  );
}
