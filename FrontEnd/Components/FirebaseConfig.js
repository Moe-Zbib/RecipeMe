import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9G6z9-HXecw8HvfWiwyoCMBIUnCxEca0",
  authDomain: "recipeapp-b2844.firebaseapp.com",
  projectId: "recipeapp-b2844",
  storageBucket: "recipeapp-b2844.appspot.com",
  messagingSenderId: "835858743793",
  appId: "1:835858743793:web:f93914507f9ee452fa8450",
  measurementId: "G-H65ZB1R05H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
