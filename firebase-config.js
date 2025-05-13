// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvqzYTaepJn-WvWMPSZJe26Ydkw-7MXLE",
    authDomain: "syncskilll.firebaseapp.com",
    projectId: "syncskilll",
    storageBucket: "syncskilll.firebasestorage.app",
    messagingSenderId: "203322315096",
    appId: "1:203322315096:web:958fc7d94806ef9a98552d",
    measurementId: "G-JWWWM2ZQSK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
