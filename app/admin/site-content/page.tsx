'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { SiteContent } from '@/types';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

export default function SiteContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  async function fetchContent() {
    const docRef = doc(db, 'siteContent', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setContent(docSnap.data() as SiteContent);
    } else {
      setContent({
        hero: {
          heading: '',
          subheading: '',
          headshotUrl: '',
          ctaButtons: [],
        },
        about: {
          content: '',
          image: '',
        },
        portfolio: {
          content: '',
          image: '',
          ctaText: '',
          ctaLink: '',
        },
        interests: {
          books: [],
          podcasts: [],
          hobbies: [],
        },
        contact: {
          email: '',
          socialLinks: {},
        },
        branding: {
          primaryColor: '',
          secondaryColor: '',
        },
      });
    }
  }

  async function handleSave() {
    if (!content) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'siteContent', 'main'), content);
      alert('Saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div>Please login</div>;
  if (!content) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Site Content</h1>

      <section>
        <h2>Hero Section</h2>
        <Input
          label="Heading"
          value={content.hero.heading}
          onChange={(e) => setContent({
            ...content,
            hero: { ...content.hero, heading: e.target.value }
          })}
        />
        <Input
          label="Subheading"
          value={content.hero.subheading}
          onChange={(e) => setContent({
            ...content,
            hero: { ...content.hero, subheading: e.target.value }
          })}
        />
        <div>
          <label>Headshot</label>
          <ImageUploader
            path="profile"
            onUpload={(url) => setContent({
              ...content,
              hero: { ...content.hero, headshotUrl: url }
            })}
          />
          {content.hero.headshotUrl && <img src={content.hero.headshotUrl} alt="Headshot" />}
        </div>
      </section>

      <section>
        <h2>About Section</h2>
        <label>Content</label>
        <RichTextEditor
          content={content.about.content}
          onChange={(html) => setContent({
            ...content,
            about: { ...content.about, content: html }
          })}
        />
        <div>
          <label>Image</label>
          <ImageUploader
            path="about"
            onUpload={(url) => setContent({
              ...content,
              about: { ...content.about, image: url }
            })}
          />
          {content.about.image && <img src={content.about.image} alt="About" />}
        </div>
      </section>

      <section>
        <h2>Portfolio Section</h2>
        <label>Content</label>
        <RichTextEditor
          content={content.portfolio.content}
          onChange={(html) => setContent({
            ...content,
            portfolio: { ...content.portfolio, content: html }
          })}
        />
        <div>
          <label>Image</label>
          <ImageUploader
            path="portfolio"
            onUpload={(url) => setContent({
              ...content,
              portfolio: { ...content.portfolio, image: url }
            })}
          />
          {content.portfolio.image && <img src={content.portfolio.image} alt="Portfolio" />}
        </div>
        <Input
          label="CTA Button Text"
          value={content.portfolio.ctaText}
          onChange={(e) => setContent({
            ...content,
            portfolio: { ...content.portfolio, ctaText: e.target.value }
          })}
        />
        <Input
          label="CTA Button Link"
          value={content.portfolio.ctaLink}
          onChange={(e) => setContent({
            ...content,
            portfolio: { ...content.portfolio, ctaLink: e.target.value }
          })}
        />
      </section>

      <section>
        <h2>Contact Section</h2>
        <Input
          label="Email"
          value={content.contact.email}
          onChange={(e) => setContent({
            ...content,
            contact: { ...content.contact, email: e.target.value }
          })}
        />
        <Input
          label="LinkedIn URL"
          value={content.contact.socialLinks.linkedin || ''}
          onChange={(e) => setContent({
            ...content,
            contact: {
              ...content.contact,
              socialLinks: { ...content.contact.socialLinks, linkedin: e.target.value }
            }
          })}
        />
        <Input
          label="Twitter URL"
          value={content.contact.socialLinks.twitter || ''}
          onChange={(e) => setContent({
            ...content,
            contact: {
              ...content.contact,
              socialLinks: { ...content.contact.socialLinks, twitter: e.target.value }
            }
          })}
        />
      </section>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save All Changes'}
      </Button>
    </div>
  );
}
