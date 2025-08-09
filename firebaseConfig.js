// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdBcYgkhvMfyGG4zXklMfOw_vUYdqYNE0",
  authDomain: "devgeek-d64c4.firebaseapp.com",
  projectId: "devgeek-d64c4",
  storageBucket: "devgeek-d64c4.firebasestorage.app",
  messagingSenderId: "113290165352",
  appId: "1:113290165352:web:8cf9abfb0d9db2bb290fdd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
