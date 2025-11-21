'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Subscriber } from '@/types';
import { format } from 'date-fns';

export default function SubscribersPage() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user]);

  async function fetchSubscribers() {
    const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscriber[];
    setSubscribers(data);
  }

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Subscribers ({subscribers.length})</h1>
      
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(sub => (
            <tr key={sub.id}>
              <td>{sub.email}</td>
              <td>{format(sub.subscribedAt.toDate(), 'MMM d, yyyy')}</td>
              <td>{sub.active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
