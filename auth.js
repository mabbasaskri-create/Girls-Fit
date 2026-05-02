// Auth & Data Management with Firebase
const ADMIN_EMAIL = "m.abbas.askri@gmail.com";

// Initialize products if not exists (empty array - no fake products)
function initProducts() {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify([]));
  }
}

// Initialize orders if not exists
function initOrders() {
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
}

initProducts();
initOrders();

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

// Product functions
function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

// Order functions
function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function generateOrderId() {
  const orders = getOrders();
  const lastId = orders.length > 0 ? parseInt(orders[orders.length - 1].id?.slice(1) || 1000) : 1000;
  return `#${lastId + 1}`;
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
