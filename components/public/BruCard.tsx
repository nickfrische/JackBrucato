import Link from 'next/link';
import { MonthlyBru } from '@/types';
import { format } from 'date-fns';

interface BruCardProps {
  bru: MonthlyBru;
}

export default function BruCard({ bru }: BruCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/monthly-brus/${bru.slug}`}>
        {bru.featuredImage.url && (
          <img src={bru.featuredImage.url} alt={bru.featuredImage.alt} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">{bru.title}</h3>
          <p className="text-gray-500 text-sm mb-3">{format(bru.publishDate.toDate(), 'MMMM d, yyyy')} • {bru.readingTime} min read</p>
          <p className="text-gray-600">{bru.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
