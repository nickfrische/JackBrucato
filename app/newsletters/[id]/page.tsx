'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Newsletter } from '@/types';
import { useParams } from 'next/navigation';

export default function NewsletterPage() {
  const params = useParams();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      const docRef = doc(db, 'newsletters', params.id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNewsletter({
          id: docSnap.id,
          ...docSnap.data(),
          date: docSnap.data().date.toDate(),
        } as Newsletter);
      }
    }
    fetchNewsletter();
  }, [params.id]);

  if (!newsletter) return <div>Loading...</div>;

  return (
    <article>
      <h1>{newsletter.title}</h1>
      <p>{newsletter.date.toLocaleDateString()}</p>
      <div>{newsletter.content}</div>
    </article>
  );
}
