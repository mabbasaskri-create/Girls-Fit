// Firebase config - Compat SDK (works with all pages)
const firebaseConfig = {
  apiKey: "AIzaSyBV3y_XshRKvCWw6GPUbUxaALI5HhbhM",
  authDomain: "girls-fit-e5735.firebaseapp.com",
  projectId: "girls-fit-e5735",
  storageBucket: "girls-fit-e5735.firebasestorage.app",
  messagingSenderId: "1077696059801",
  appId: "1:1077696059801:web:51778a835c80a70bb91b08",
  measurementId: "G-5Y2BYVN7H5",
  databaseURL: "https://girls-fit-e5735-default-rtdb.firebaseio.com"
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
  // Test connection
  window.firebaseDB.ref('.info/connected').once('value', function(snap) {
    if (snap.val() === true) {
      console.log('✅ Firebase Realtime Database connected!');
    } else {
      console.log('⚠️ Firebase Database - not connected yet (may need correct URL)');
    }
  });
  console.log('✅ Firebase Realtime Database initialized');
} catch (err) {
  console.error('❌ Firebase Realtime Database init error:', err);
  console.log('📋 To fix: Go to Firebase Console → Realtime Database → Create Database');
  console.log('📋 Correct Database URL should be in Firebase Console → Realtime Database → "Data" tab (top)');
}
