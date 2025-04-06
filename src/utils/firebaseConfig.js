// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5OnN05BdpGNCbVvIEGRrSsm92_xUjWn0",
  authDomain: "reswap-dev.firebaseapp.com",
  projectId: "reswap-dev",
  storageBucket: "reswap-dev.firebasestorage.app",
  messagingSenderId: "913341079048",
  appId: "1:913341079048:web:00d1a3e50eeab0595bfbbd",
  measurementId: "G-XGE3GPQN52"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, onMessage };