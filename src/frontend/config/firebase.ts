// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI7ygKQq7wGiXQrukldiKuqpufmToEJmE",
  authDomain: "nineedu-e2cd7.firebaseapp.com",
  projectId: "nineedu-e2cd7",
  storageBucket: "nineedu-e2cd7.firebasestorage.app",
  messagingSenderId: "380673344",
  appId: "1:380673344:web:a2dbc56fd7c08f9358aea5",
  measurementId: "G-427XGLMY2D",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

let analytics;

if (typeof window !== "undefined") {
  isSupported().then((isSupported) => {
    if (isSupported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
