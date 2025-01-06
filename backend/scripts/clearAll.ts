import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = getFirestore();
const storage = getStorage();
const bucket = storage.bucket();

async function clearAll() {
  try {
    console.log('Starting cleanup...');

    // Collections to clear
    const collections = ['videos', 'likes', 'dislikes', 'comments'];
    
    // Clear Firestore collections
    for (const collectionName of collections) {
      console.log(`Clearing ${collectionName} collection...`);
      const snapshot = await db.collection(collectionName).get();
      
      // Process in batches of 500 (Firestore limit)
      const batchSize = 500;
      const batches = [];
      
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batch = db.batch();
        snapshot.docs.slice(i, i + batchSize).forEach((doc) => {
          batch.delete(doc.ref);
        });
        batches.push(batch.commit());
      }
      
      await Promise.all(batches);
      console.log(`Cleared ${snapshot.docs.length} documents from ${collectionName}`);
    }

    // Clear storage
    console.log('Clearing storage files...');
    const [files] = await bucket.getFiles({ prefix: 'videos/' });
    for (const file of files) {
      await file.delete();
    }
    const [thumbnails] = await bucket.getFiles({ prefix: 'thumbnails/' });
    for (const file of thumbnails) {
      await file.delete();
    }

    console.log('Successfully cleared all data');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

clearAll();