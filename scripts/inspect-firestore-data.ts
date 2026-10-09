import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../src/firebase/config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function inspect() {
  const collections = [
    'contentItems',
    'podcasts',
    'projects',
    'testimonials',
    'featuredVideos',
    'resources',
    'messages',
    'adminRoles'
  ];

  console.log("=== INSPECTING FIRESTORE PROJECT: " + firebaseConfig.projectId + " ===");
  
  for (const collName of collections) {
    try {
      const snap = await getDocs(collection(db, collName));
      console.log(`[Collection: ${collName}] documents: ${snap.size}`);
      snap.forEach(d => {
        const data = d.data();
        console.log(`  -> ID: ${d.id} | title/quote/name: "${data.title || data.quote || data.name || data.authorName || 'N/A'}"`);
      });
    } catch (e: any) {
      console.log(`[Collection: ${collName}] ERROR:`, e.code || e.message);
    }
  }

  try {
    const settingsSnap = await getDoc(doc(db, "siteSettings", "general"));
    console.log("[Doc: siteSettings/general] exists:", settingsSnap.exists());
    if (settingsSnap.exists()) {
      console.log("  -> data keys:", Object.keys(settingsSnap.data() || {}));
    }
  } catch (e: any) {
    console.log("[Doc: siteSettings/general] ERROR:", e.code || e.message);
  }

  process.exit(0);
}

inspect();
