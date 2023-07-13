// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBipwInjazG5CwsxyzJERjCy5R9bBaISII",
  authDomain: "storeant.firebaseapp.com",
  projectId: "storeant",
  storageBucket: "storeant.appspot.com",
  messagingSenderId: "945696756215",
  appId: "1:945696756215:web:1f74d34f62d1c640311ef2",
  measurementId: "G-E22DXYR0LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage();