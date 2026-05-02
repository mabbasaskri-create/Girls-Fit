// Auth & Data Management with Firebase
const ADMIN_EMAIL = "m.abbas.askri@gmail.com";

// Initialize products if not exists
function initProducts() {
  if (!localStorage.getItem('products')) {
    const initialProducts = [
      { id: 1, name: "Pink Tote Bag", price: 8400, category: "handbag", featured: true, image: "" },
      { id: 2, name: "Floral Pouch", price: 4200, category: "pouch", featured: true, image: "" },
      { id: 3, name: "Mini Sling Bag", price: 7000, category: "handbag", featured: true, image: "" },
      { id: 4, name: "Bow Makeup Kit", price: 5600, category: "pouch", featured: true, image: "" },
      { id: 5, name: "Pink Tote", price: 8400, category: "handbag", image: "" },
      { id: 6, name: "Mini Sling", price: 7000, category: "handbag", image: "" },
      { id: 7, name: "Cute Backpack", price: 11200, category: "handbag", image: "" },
      { id: 8, name: "Clutch Bag", price: 6400, category: "handbag", image: "" },
      { id: 9, name: "Heart Handbag", price: 9800, category: "handbag", image: "" },
      { id: 10, name: "Bow Wallet", price: 4500, category: "handbag", image: "" },
      { id: 11, name: "Bow Pouch", price: 3600, category: "pouch", image: "" },
      { id: 12, name: "Sakura Pouch", price: 4800, category: "pouch", image: "" },
      { id: 13, name: "Heart Pouch", price: 3900, category: "pouch", image: "" },
      { id: 14, name: "Glitter Pouch", price: 5000, category: "pouch", image: "" },
      { id: 15, name: "Unicorn Pouch", price: 5300, category: "pouch", image: "" }
    ];
    localStorage.setItem('products', JSON.stringify(initialProducts));
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

// Google Sign In
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
      
      if (user.email === 'm.abbas.askri@gmail.com') {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed: " + error.message);
    });
}

// Logout function
window.logoutUser = function() {
  firebase.auth().signOut().then(() => {
    window.currentFirebaseUser = null;
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
}
