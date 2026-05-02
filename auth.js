// Auth & Data Management with Firebase
const ADMIN_EMAIL = "m.abbas.askri@gmail.com";

// Initialize Firebase Realtime Database references
function getProductsRef() {
  return window.firebaseDB.ref('products');
}

function getOrdersRef() {
  return window.firebaseDB.ref('orders');
}

// Get products from Firebase Realtime DB
function getProducts() {
  // Fallback to localStorage if Firebase not ready
  return JSON.parse(localStorage.getItem('products')) || [];
}

// Save products to Firebase Realtime DB
function saveProducts(products) {
  try {
    if (window.firebaseDB) {
      window.firebaseDB.ref('products').set(products);
    }
    localStorage.setItem('products', JSON.stringify(products));
  } catch(err) {
    console.error('saveProducts error:', err);
    localStorage.setItem('products', JSON.stringify(products));
  }
}

// Get orders from Firebase Realtime DB
function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

// Save orders to Firebase Realtime DB
function saveOrders(orders) {
  try {
    if (window.firebaseDB) {
      window.firebaseDB.ref('orders').set(orders);
    }
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch(err) {
    console.error('saveOrders error:', err);
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}

// Generate order ID
function generateOrderId() {
  const orders = getOrders();
  const lastId = orders.length > 0 ? parseInt(orders[orders.length - 1].id?.slice(1) || 1000) : 1000;
  return `#${lastId + 1}`;
}

// Sync products from Firebase on load (for ALL devices)
function syncProductsFromFirebase() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.ref('products').once('value').then(function(snapshot) {
    const data = snapshot.val();
    if (data) {
      const products = Array.isArray(data) ? data : Object.values(data);
      localStorage.setItem('products', JSON.stringify(products));
      console.log('Products synced from Firebase:', products.length);
      // Reload products display if function exists
      if (typeof loadFeaturedProducts === 'function') loadFeaturedProducts();
      if (typeof loadHandbags === 'function') loadHandbags();
      if (typeof loadPouches === 'function') loadPouches();
      if (typeof loadProducts === 'function') loadProducts();
    }
  }).catch(function(err) {
    console.error('Sync products error:', err);
  });
}

// Sync orders from Firebase
function syncOrdersFromFirebase() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.ref('orders').once('value').then(function(snapshot) {
    const data = snapshot.val();
    if (data) {
      const orders = Array.isArray(data) ? data : Object.values(data);
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log('Orders synced from Firebase:', orders.length);
      if (typeof loadOrders === 'function') loadOrders();
      if (typeof loadUserOrders === 'function') loadUserOrders(firebase.auth().currentUser);
    }
  }).catch(function(err) {
    console.error('Sync orders error:', err);
  });
}

// Listen for realtime product updates (ALL devices get updates instantly)
function listenForProductUpdates() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.ref('products').on('value', function(snapshot) {
    const data = snapshot.val();
    if (data) {
      const products = Array.isArray(data) ? data : Object.values(data);
      localStorage.setItem('products', JSON.stringify(products));
      // Reload displays
      if (typeof loadFeaturedProducts === 'function') loadFeaturedProducts();
      if (typeof loadHandbags === 'function') loadHandbags();
      if (typeof loadPouches === 'function') loadPouches();
      if (typeof loadProducts === 'function') loadProducts();
    }
  });
}

// Listen for realtime order updates
function listenForOrderUpdates() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.ref('orders').on('value', function(snapshot) {
    const data = snapshot.val();
    if (data) {
      const orders = Array.isArray(data) ? data : Object.values(data);
      localStorage.setItem('orders', JSON.stringify(orders));
      if (typeof loadOrders === 'function') loadOrders();
      if (typeof loadUserOrders === 'function') loadUserOrders(firebase.auth().currentUser);
    }
  });
}

// Initialize - sync on load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    syncProductsFromFirebase();
    syncOrdersFromFirebase();
    listenForProductUpdates();
    listenForOrderUpdates();
  }, 1000); // Wait for Firebase to initialize
});

// Get current Firebase user
function getCurrentUser() {
  return window.currentFirebaseUser || null;
}

// Check auth
function isLoggedIn() {
  return !!getCurrentUser();
}

// Check admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.email === ADMIN_EMAIL;
}

// Google Sign In - accessible globally
window.signInWithGoogle = function() {
  console.log("Google sign-in button clicked");
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      window.currentFirebaseUser = user;
      console.log("Sign-in success:", user.email);
      
      if (user.email === ADMIN_EMAIL) {
        window.location.href = "admin.html";
      } else {
        window.location.href = window.location.pathname;
      }
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed: " + error.message);
    });
}

// Logout function
window.logoutUser = function() {
  firebase.auth().signOut().then(function() {
    window.currentFirebaseUser = null;
    window.location.href = "login.html";
  }).catch(function(error) {
    console.error("Logout error:", error);
  });
}
