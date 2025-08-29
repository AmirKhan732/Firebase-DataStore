import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdBcYgkhvMfyGG4zXklMfOw_vUYdqYNE0",
  authDomain: "devgeek-d64c4.firebaseapp.com",
  projectId: "devgeek-d64c4",
  storageBucket: "devgeek-d64c4.appspot.com",
  messagingSenderId: "113290165352",
  appId: "1:113290165352:web:8cf9abfb0d9db2bb290fdd",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // if already initialized, fallback to getAuth
  auth = getAuth(app);
}

export { db, auth };
