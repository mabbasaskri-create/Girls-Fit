// Firebase config - Compat SDK (works with all pages)
const firebaseConfig = {
  apiKey: "AIzaSyDwdHkfb9DBVV5oLYw1WaEPfVN1_MYm30Y",
  authDomain: "girls-67c84.firebaseapp.com",
  projectId: "girls-67c84",
  storageBucket: "girls-67c84.firebasestorage.app",
  messagingSenderId: "87884221171",
  appId: "1:87884221171:web:12f70ce888930fe1ab4586",
  measurementId: "G-SRPHVVDZWK",
  databaseURL: "https://girls-67c84-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = firebase.app();
window.firebaseAuth = firebase.auth();
// Use the correct bucket explicitly
window.firebaseStorage = firebase.storage();
// Initialize Realtime Database
try {
  window.firebaseDB = firebase.database();
  console.log('✅ Firebase Realtime Database initialized');
} catch (err) {
  console.error('❌ Firebase Realtime Database init error:', err);
  console.log('📋 To fix: Go to Firebase Console → Realtime Database → Create Database');
}
