// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'devspeak-mern.firebaseapp.com',
  projectId: 'devspeak-mern',
  storageBucket: 'devspeak-mern.appspot.com',
  messagingSenderId: '540539326454',
  appId: '1:540539326454:web:279681ad35959fa92101d7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
