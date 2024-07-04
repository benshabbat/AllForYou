import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);

// קבלת התייחסות ל-Firestore
export const db = getFirestore(app);

// קבלת התייחסות לשירות האותנטיקציה
export const auth = getAuth(app);
