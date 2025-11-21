import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirestore() {
  try {
    await setDoc(doc(db, 'siteContent', 'main'), {
      hero: {
        heading: 'Jack Brucato',
        subheading: 'Author of The Monthly Bru',
        headshotUrl: '',
        ctaButtons: [
          {
            text: 'Read Latest Bru',
            link: '/monthly-brus'
          },
          {
            text: 'View Portfolio',
            link: '#portfolio'
          }
        ]
      },
      about: {
        content: '<h2>About Me</h2><p>Welcome! Edit this content in the admin panel.</p>',
        image: ''
      },
      portfolio: {
        content: '<h2>My Work</h2><p>Add your professional work and accomplishments here.</p>',
        image: '',
        ctaText: "Let's Work Together",
        ctaLink: '#contact'
      },
      interests: {
        books: [],
        podcasts: [],
        hobbies: []
      },
      contact: {
        email: 'your@email.com',
        socialLinks: {
          linkedin: '',
          twitter: '',
          instagram: ''
        }
      },
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b'
      }
    });

    console.log('✅ Firebase initialized successfully!');
    console.log('You can now:');
    console.log('1. Visit http://localhost:3000');
    console.log('2. Click "Admin Login" to sign in with Google');
    console.log('3. Edit site content at /admin/site-content');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    process.exit(1);
  }
}

initializeFirestore();
