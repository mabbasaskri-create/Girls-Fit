// Auth & Data Management with Firebase Firestore
const ADMIN_EMAIL = "m.abbas.askri@gmail.com";

// Get products from Firestore
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

// Save products to Firestore
function saveProducts(products) {
  try {
    localStorage.setItem('products', JSON.stringify(products));
    if (window.firebaseDB) {
      // Firestore: save as collection
      const batch = window.firebaseDB.batch();
      const productsRef = window.firebaseDB.collection('products');
      
      // Clear existing
      productsRef.get().then(function(snapshot) {
        snapshot.forEach(function(doc) {
          batch.delete(doc.ref);
        });
        // Add new products
        products.forEach(function(product, index) {
          batch.set(productsRef.doc(String(index)), product);
        });
        return batch.commit();
      }).then(function() {
        console.log('✅ Products saved to Firestore');
      }).catch(function(err) {
        console.error('Firestore save error:', err);
      });
    }
  } catch(err) {
    console.error('saveProducts error:', err);
  }
}

// Get orders from Firestore
function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

// Save orders to Firestore
function saveOrders(orders) {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
    if (window.firebaseDB) {
      const batch = window.firebaseDB.batch();
      const ordersRef = window.firebaseDB.collection('orders');
      
      ordersRef.get().then(function(snapshot) {
        snapshot.forEach(function(doc) {
          batch.delete(doc.ref);
        });
        orders.forEach(function(order, index) {
          batch.set(ordersRef.doc(String(index)), order);
        });
        return batch.commit();
      }).then(function() {
        console.log('✅ Orders saved to Firestore');
      }).catch(function(err) {
        console.error('Firestore save error:', err);
      });
    }
  } catch(err) {
    console.error('saveOrders error:', err);
  }
}

// Generate order ID
function generateOrderId() {
  const orders = getOrders();
  const lastId = orders.length > 0 ? parseInt(orders[orders.length - 1].id?.slice(1) || 1000) : 1000;
  return `#${lastId + 1}`;
}

// Sync products from Firestore on load (for ALL devices)
function syncProductsFromFirebase() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.collection('products').get().then(function(snapshot) {
    const products = [];
    snapshot.forEach(function(doc) {
      products.push(doc.data());
    });
    
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
      console.log('✅ Products synced from Firestore:', products.length);
    } else {
      console.log('Firestore products empty, clearing localStorage');
      localStorage.setItem('products', JSON.stringify([]));
    }
    
    // Reload products display if function exists
    if (typeof loadFeaturedProducts === 'function') loadFeaturedProducts();
    if (typeof loadHandbags === 'function') loadHandbags();
    if (typeof loadPouches === 'function') loadPouches();
    if (typeof loadProducts === 'function') loadProducts();
  }).catch(function(err) {
    console.error('Sync products error:', err);
  });
}

// Sync orders from Firestore
function syncOrdersFromFirebase() {
  if (!window.firebaseDB) return;
  
  window.firebaseDB.collection('orders').get().then(function(snapshot) {
    const orders = [];
    snapshot.forEach(function(doc) {
      orders.push(doc.data());
    });
    
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log('✅ Orders synced from Firestore:', orders.length);
    }
    
    if (typeof loadOrders === 'function') loadOrders();
    if (typeof loadUserOrders === 'function') loadUserOrders(firebase.auth().currentUser);
  }).catch(function(err) {
    console.error('Sync orders error:', err);
  });
}

// Listen for Firestore product updates (polling-based for all devices)
function listenForProductUpdates() {
  if (!window.firebaseDB) return;
  
  // Poll every 30 seconds for updates
  setInterval(function() {
    syncProductsFromFirebase();
  }, 30000);
}

// Listen for Firestore order updates
function listenForOrderUpdates() {
  if (!window.firebaseDB) return;
  
  setInterval(function() {
    syncOrdersFromFirebase();
  }, 30000);
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
