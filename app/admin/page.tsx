'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBrus: 0,
    publishedBrus: 0,
    draftBrus: 0,
    totalSubscribers: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    const brusSnapshot = await getDocs(collection(db, 'monthlyBrus'));
    const publishedQuery = query(collection(db, 'monthlyBrus'), where('status', '==', 'published'));
    const publishedSnapshot = await getDocs(publishedQuery);
    const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));

    setStats({
      totalBrus: brusSnapshot.size,
      publishedBrus: publishedSnapshot.size,
      draftBrus: brusSnapshot.size - publishedSnapshot.size,
      totalSubscribers: subscribersSnapshot.size,
    });
  }

  if (!user) return <div>Please login to access admin</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <Card>
          <h3>Total Brus</h3>
          <p>{stats.totalBrus}</p>
        </Card>
        <Card>
          <h3>Published</h3>
          <p>{stats.publishedBrus}</p>
        </Card>
        <Card>
          <h3>Drafts</h3>
          <p>{stats.draftBrus}</p>
        </Card>
        <Card>
          <h3>Subscribers</h3>
          <p>{stats.totalSubscribers}</p>
        </Card>
      </div>

      <div>
        <h2>Quick Actions</h2>
        <Link href="/admin/monthly-brus/new">
          <Button>Create New Bru</Button>
        </Link>
        <Link href="/admin/monthly-brus">
          <Button variant="secondary">Manage Brus</Button>
        </Link>
        <Link href="/admin/site-content">
          <Button variant="secondary">Edit Site Content</Button>
        </Link>
        <Link href="/admin/subscribers">
          <Button variant="secondary">View Subscribers</Button>
        </Link>
      </div>
    </div>
  );
}
