// Firebase config - Compat SDK (works with all pages)
const firebaseConfig = {
  apiKey: "AIzaSyBySV3y_XshRKvCWw6GPUbUxaALI5HhbhM",
  authDomain: "girls-fit-e5735.firebaseapp.com",
  projectId: "girls-fit-e5735",
  storageBucket: "girls-fit-e5735.firebasestorage.app",
  messagingSenderId: "1077696059801",
  appId: "1:1077696059801:web:a237b96338a04408b91b08",
  measurementId: "G-4465R1LWS9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = firebase.app();
window.firebaseAuth = firebase.auth();
// Use the correct bucket explicitly
window.firebaseStorage = firebase.storage();
// Initialize Firestore
try {
  window.firebaseDB = firebase.firestore();
  console.log('✅ Firebase Firestore initialized');
} catch (err) {
  console.error('❌ Firebase Firestore init error:', err);
  console.log('📋 To fix: Go to Firebase Console → Firestore Database → Create Database');
}
