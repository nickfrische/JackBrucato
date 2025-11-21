'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { MonthlyBru } from '@/types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { slugify } from '@/lib/utils/slugify';
import { calculateReadingTime } from '@/lib/utils/reading-time';

export default function EditMonthlyBruPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [bru, setBru] = useState<MonthlyBru | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState({ url: '', alt: '', caption: '' });
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBru() {
      const docRef = doc(db, 'monthlyBrus', params.id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as MonthlyBru;
        setBru({ ...data, id: docSnap.id });
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt);
        setFeaturedImage(data.featuredImage);
        setCategory(data.category);
        setTags(data.tags.join(', '));
        setStatus(data.status);
      }
    }
    fetchBru();
  }, [params.id]);

  async function handleSave() {
    if (!user || !bru) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'monthlyBrus', params.id as string), {
        title,
        slug: slugify(title),
        content,
        excerpt: excerpt || content.substring(0, 160),
        featuredImage,
        category,
        tags: tags.split(',').map(t => t.trim()),
        status,
        readingTime: calculateReadingTime(content),
        updatedAt: Timestamp.now(),
      });
      router.push('/admin/monthly-brus');
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div>Please login</div>;
  if (!bru) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Monthly Bru</h1>
      
      <div>
        <div>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />

          <div>
            <label>Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div>
            <label>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary (optional)"
            />
          </div>
        </div>

        <div>
          <div>
            <label>Featured Image</label>
            <ImageUploader
              path="monthly-brus"
              onUpload={(url) => setFeaturedImage({ ...featuredImage, url })}
            />
            {featuredImage.url && <img src={featuredImage.url} alt="Current" />}
            <Input
              placeholder="Alt text"
              value={featuredImage.alt}
              onChange={(e) => setFeaturedImage({ ...featuredImage, alt: e.target.value })}
            />
          </div>

          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Business, Leadership"
          />

          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />

          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
}
