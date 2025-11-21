# Firebase Setup Instructions

## 1. Firestore Database Rules

Go to Firebase Console > Firestore Database > Rules tab and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Special count document
    match /users/count {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Monthly Brus - anyone can read published, only admins can write
    match /monthlyBrus/{bruId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    
    // Site Content - anyone can read, only admins can write
    match /siteContent/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Subscribers - anyone can subscribe, only admins can manage
    match /subscribers/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
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
3. Add your domain to authorized domains (localhost is already added by default)

## 4. Initialize Firebase Data

Run this command to create the initial siteContent document:

```bash
npm run init-firebase
```

## 5. How Admin Access Works

**First User = Admin**
- The **first person** to sign in with Google will automatically become an admin
- Their user document will be created with `role: 'admin'`
- They will have full access to all admin features

**Subsequent Users = Viewers**
- Anyone who signs in after the first user will be a `viewer`
- They can only view published content
- They cannot access `/admin` routes

**To Make Additional Admins:**
1. Go to Firebase Console > Firestore Database
2. Find the user document in the `users` collection
3. Change their `role` field from `'viewer'` to `'admin'`

## 6. Deploy Rules

Click "Publish" in both Firestore Rules and Storage Rules tabs.

## 7. Start Using the Site

1. Visit http://localhost:3000
2. Click "Admin Login" to sign in with Google (you'll be the first admin!)
3. Access the admin panel at `/admin`
4. Edit site content at `/admin/site-content`
5. Create Monthly Bru posts at `/admin/monthly-brus/new`

## Collections Structure

Your Firestore will have these collections:

- `users` - User accounts with roles (admin/viewer)
- `siteContent` - Main document with hero, about, portfolio, interests, contact
- `monthlyBrus` - Blog posts with rich content
- `subscribers` - Newsletter email subscribers
