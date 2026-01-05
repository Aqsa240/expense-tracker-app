import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBq9FGQsCdsF2MNxhXZBgVW1YX-3usceZM",
    authDomain: "practical-cd037.firebaseapp.com",
    projectId: "practical-cd037",
    storageBucket: "practical-cd037.firebasestorage.app",
    messagingSenderId: "617581290144",
    appId: "1:617581290144:web:52f4b5321309d2d4fcdfc5",
    measurementId: "G-908BZQYZVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
