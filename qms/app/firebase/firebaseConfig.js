// app/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpE_UpykwXOicCSGbQJBiAJ69rRQew7uU",
  authDomain: "msqms-fb30e.firebaseapp.com",
  projectId: "msqms-fb30e",
  storageBucket: "msqms-fb30e.firebasestorage.app",
  messagingSenderId: "157445785136",
  appId: "1:157445785136:web:5f53c5e4dd865301ed4ff5",
  measurementId: "G-7LSMFP5MLM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
