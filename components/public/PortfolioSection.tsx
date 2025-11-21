'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteContent } from '@/types';
import Button from '@/components/shared/Button';

export default function PortfolioSection() {
  const [content, setContent] = useState<SiteContent['portfolio'] | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().portfolio as SiteContent['portfolio']);
      } else {
        setContent({ content: '<h2>My Work</h2><p>Add your professional work here.</p>', image: '', ctaText: "Let's Work Together", ctaLink: '#contact' });
      }
    }
    fetchContent();
  }, []);

  if (!content) return null;

  return (
    <section className="py-20 px-4 bg-white" id="portfolio">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          {content.image && <img src={content.image} alt="Portfolio" className="rounded-lg shadow-lg w-full" />}
        </div>
        <div>
          <div className="prose prose-lg mb-6" dangerouslySetInnerHTML={{ __html: content.content }} />
          <Button onClick={() => window.location.href = content.ctaLink}>
            {content.ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
