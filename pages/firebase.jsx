// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV4bbFky3zA5txgplrJxz8X0zqnz2K7aI",
  authDomain: "uploadingfile-petch.firebaseapp.com",
  projectId: "uploadingfile-petch",
  storageBucket: "uploadingfile-petch.firebasestorage.app",
  messagingSenderId: "587733213944",
  appId: "1:587733213944:web:e89728122e79eec911d10d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)