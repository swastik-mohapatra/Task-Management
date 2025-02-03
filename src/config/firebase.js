import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxebFg7uEGr8RYwhG7YqC8GY7tu0e1K30",
  authDomain: "task-management-e4285.firebaseapp.com",
  projectId: "task-management-e4285",
  storageBucket: "task-management-e4285.firebasestorage.app",
  messagingSenderId: "465983694993",
  appId: "1:465983694993:web:6b0baaeea78d834b5c7730",
  measurementId: "G-T6YSBKGM7P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
