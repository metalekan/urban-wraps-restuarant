import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { seedWraps, seedIngredients, seedAddOns } from '../lib/firebase/seed-data';

// Initialize Firebase (without Auth)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔧 Initializing Firebase...');
console.log('Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting database seed...');

    // Seed Wraps
    console.log('\n📦 Seeding wraps...');
    for (const wrap of seedWraps) {
      const wrapData = {
        ...wrap,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'wraps'), wrapData);
      console.log(`✅ Added wrap: ${wrap.name} (${docRef.id})`);
    }

    // Seed Ingredients
    console.log('\n🥬 Seeding ingredients...');
    for (const ingredient of seedIngredients) {
      const docRef = await addDoc(collection(db, 'ingredients'), ingredient);
      console.log(`✅ Added ingredient: ${ingredient.name} (${docRef.id})`);
    }

    // Seed Add-Ons
    console.log('\n🌶️ Seeding add-ons...');
    for (const addOn of seedAddOns) {
      const docRef = await addDoc(collection(db, 'addOns'), addOn);
      console.log(`✅ Added add-on: ${addOn.name} (${docRef.id})`);
    }

    console.log('\n✨ Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- ${seedWraps.length} wraps`);
    console.log(`- ${seedIngredients.length} ingredients`);
    console.log(`- ${seedAddOns.length} add-ons`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n🎉 Seed complete! You can now use the order builder.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });
