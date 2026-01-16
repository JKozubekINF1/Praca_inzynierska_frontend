// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC3PwxunxS0-CuLSO-QNfRXcyjVBLBJikQ',
  authDomain: 'market-app-040902.firebaseapp.com',
  databaseURL: 'https://market-app-040902-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'market-app-040902',
  storageBucket: 'market-app-040902.firebasestorage.app',
  messagingSenderId: '594203752402',
  appId: '1:594203752402:web:b0a0e9a3cb4634af37ba0b',
  measurementId: 'G-F9XHC3C4Y2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
