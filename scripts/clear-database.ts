import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Initialize Firebase (without Auth)
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

async function clearCollection(collectionName: string) {
  console.log(`\n🗑️  Clearing ${collectionName}...`);
  const snapshot = await getDocs(collection(db, collectionName));
  
  let count = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, collectionName, document.id));
    count++;
    console.log(`  ✓ Deleted ${document.id}`);
  }
  
  console.log(`✅ Deleted ${count} documents from ${collectionName}`);
}

async function clearDatabase() {
  try {
    console.log('🧹 Starting database cleanup...\n');

    await clearCollection('wraps');
    await clearCollection('ingredients');
    await clearCollection('addOns');

    console.log('\n✨ Database cleared successfully!');
    console.log('You can now run "npm run seed" to add fresh data.');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

clearDatabase()
  .then(() => {
    console.log('\n🎉 Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  });
