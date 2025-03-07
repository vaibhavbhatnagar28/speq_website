import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these values with your Firebase project details
const firebaseConfig = {
    apiKey: "AIzaSyB0tgMvutl2MFWCa1MWGC7hscO8qPOifDQ",
    authDomain: "speq2-8b1b7.firebaseapp.com",
    projectId: "speq2-8b1b7",
    storageBucket: "speq2-8b1b7.firebasestorage.app",
    messagingSenderId: "230345752512",
    appId: "1:230345752512:web:6f73a20beb0ce8c7ff5225",
    measurementId: "G-JQJ99LQWN4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
