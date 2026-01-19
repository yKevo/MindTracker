import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Read config from environment variables with safe fallbacks.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC7okzeIMGZmRJb_CxO-_xt8L5k0P5EITA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mind-tracker-c2eb9.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mind-tracker-c2eb9",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mind-tracker-c2eb9.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "681852175282",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:681852175282:web:1bf5e34f28ddbc0c0c5aab",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-MBHZ0VPL34"
};

// Initialize Firebase app (idempotent if hot-reloading)
const app = initializeApp(firebaseConfig);

// Initialize analytics only in the browser and if measurementId is present
let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // ignore analytics initialization errors (e.g., in CI or non-browser env)
    // console.warn('Firebase analytics not initialized', e);
  }
}

// Export commonly used services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };

export default app;
