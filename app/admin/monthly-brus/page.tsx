'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { MonthlyBru } from '@/types';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { format } from 'date-fns';

export default function AdminMonthlyBrusPage() {
  const { user } = useAuth();
  const [brus, setBrus] = useState<MonthlyBru[]>([]);

  useEffect(() => {
    if (user) {
      fetchBrus();
    }
  }, [user]);

  async function fetchBrus() {
    const q = query(collection(db, 'monthlyBrus'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MonthlyBru[];
    setBrus(data);
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, 'monthlyBrus', id));
      fetchBrus();
    }
  }

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <div>
        <h1>Manage Monthly Brus</h1>
        <Link href="/admin/monthly-brus/new">
          <Button>Create New</Button>
        </Link>
      </div>

      <div>
        {brus.map(bru => (
          <div key={bru.id}>
            <h3>{bru.title}</h3>
            <p>{format(bru.createdAt.toDate(), 'MMM d, yyyy')}</p>
            <span>{bru.status}</span>
            <div>
              <Link href={`/admin/monthly-brus/${bru.id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="ghost" onClick={() => handleDelete(bru.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
