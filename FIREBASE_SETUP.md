# Firebase Setup Instructions

## 1. Firestore Database Rules

Go to Firebase Console > Firestore Database > Rules tab and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to read published monthly brus
    match /monthlyBrus/{bruId} {
      allow read: if resource.data.status == 'published' || request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Allow anyone to read site content
    match /siteContent/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow anyone to subscribe (create), admin to read/manage
    match /subscribers/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## 2. Storage Rules

Go to Firebase Console > Storage > Rules tab and paste this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 3. Authentication Setup

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Google" provider
3. Add your domain to authorized domains

## 4. Initial Data Setup

After deploying the rules, you need to create an initial siteContent document:

1. Go to Firestore Database
2. Create collection: `siteContent`
3. Create document with ID: `main`
4. Add these fields:

```json
{
  "hero": {
    "heading": "Jack Brucato",
    "subheading": "Author of The Monthly Bru",
    "headshotUrl": "",
    "ctaButtons": [
      {
        "text": "Read Latest Bru",
        "link": "#monthly-bru"
      },
      {
        "text": "View Portfolio",
        "link": "#portfolio"
      }
    ]
  },
  "about": {
    "content": "<p>Welcome to my portfolio</p>",
    "image": ""
  },
  "portfolio": {
    "content": "<p>My professional work</p>",
    "image": "",
    "ctaText": "Let's Work Together",
    "ctaLink": "#contact"
  },
  "interests": {
    "books": [],
    "podcasts": [],
    "hobbies": []
  },
  "contact": {
    "email": "your@email.com",
    "socialLinks": {
      "linkedin": "",
      "twitter": "",
      "instagram": ""
    }
  },
  "branding": {
    "primaryColor": "#000000",
    "secondaryColor": "#666666"
  }
}
```

## 5. Deploy Rules

Click "Publish" in both Firestore Rules and Storage Rules tabs.
