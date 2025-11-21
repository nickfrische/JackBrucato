import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
}

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'viewer';
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface MonthlyBru {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishDate: Timestamp;
  readingTime: number;
  author: {
    name: string;
    bio: string;
    photo: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  analytics: {
    views: number;
    shares: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SiteContent {
  hero: {
    heading: string;
    subheading: string;
    headshotUrl: string;
    ctaButtons: Array<{
      text: string;
      link: string;
    }>;
  };
  about: {
    content: string;
    image: string;
  };
  portfolio: {
    content: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  interests: {
    books: Array<{
      title: string;
      author: string;
      cover: string;
      link: string;
    }>;
    podcasts: Array<{
      name: string;
      host: string;
      description: string;
      link: string;
    }>;
    hobbies: Array<{
      name: string;
      description: string;
    }>;
  };
  contact: {
    email: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp;
  active: boolean;
}
