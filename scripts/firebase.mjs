// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy8UAJIPKWgY1URQfN4vk6ySLiczStUd4",
  authDomain: "web-dev-1001.firebaseapp.com",
  projectId: "web-dev-1001",
  storageBucket: "web-dev-1001.appspot.com",
  messagingSenderId: "832750214542",
  appId: "1:832750214542:web:663837d37451cc09c758df",
  measurementId: "G-DXLXQCQL8Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);