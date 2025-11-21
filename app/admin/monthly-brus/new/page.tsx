'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { slugify } from '@/lib/utils/slugify';
import { calculateReadingTime } from '@/lib/utils/reading-time';

export default function NewMonthlyBruPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState({ url: '', alt: '', caption: '' });
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!user) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'monthlyBrus'), {
        title,
        slug: slugify(title),
        content,
        excerpt: excerpt || content.substring(0, 160),
        featuredImage,
        category,
        tags: tags.split(',').map(t => t.trim()),
        status,
        publishDate: status === 'published' ? Timestamp.now() : Timestamp.now(),
        readingTime: calculateReadingTime(content),
        author: {
          name: user.displayName || 'Jack Brucato',
          bio: 'Author bio',
          photo: user.photoURL || '',
        },
        seo: {
          metaTitle: title,
          metaDescription: excerpt || content.substring(0, 160),
        },
        analytics: {
          views: 0,
          shares: 0,
        },
        createdAt: Timestamp.now(),
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

  return (
    <div>
      <h1>Create New Monthly Bru</h1>
      
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
            {saving ? 'Saving...' : status === 'published' ? 'Publish' : 'Save Draft'}
          </Button>
        </div>
      </div>
    </div>
  );
}
