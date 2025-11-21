'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteContent } from '@/types';

export default function ContactSection() {
  const [content, setContent] = useState<SiteContent['contact'] | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const docRef = doc(db, 'siteContent', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().contact as SiteContent['contact']);
      }
    }
    fetchContent();
  }, []);

  if (!content) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section className="py-20 px-4 bg-gray-50" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
        <p className="text-xl mb-8">
          Email: <a href={`mailto:${content.email}`} className="text-blue-600 hover:underline">{content.email}</a>
        </p>
        
        <div className="flex gap-6 justify-center">
          {content.socialLinks.linkedin && (
            <a href={content.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition">
              LinkedIn
            </a>
          )}
          {content.socialLinks.twitter && (
            <a href={content.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition">
              Twitter
            </a>
          )}
          {content.socialLinks.instagram && (
            <a href={content.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition">
              Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
