import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKlooJRaBzxbZDF5NNceC4QIGslSOmpic",
  authDomain: "mindtracker-aacb5.firebaseapp.com",
  projectId: "mindtracker-aacb5",
  storageBucket: "mindtracker-aacb5.appspot.com",
  messagingSenderId: "76543168702",
  appId: "1:76543168702:web:4127ea8834eda85cb50eef"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
