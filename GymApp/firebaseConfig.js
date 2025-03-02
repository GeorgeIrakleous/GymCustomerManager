// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN_HERE", // Replace with your Firebase Auth Domain
  projectId: "YOUR_PROJECT_ID_HERE", // Replace with your Firebase Project ID
  storageBucket: "YOUR_STORAGE_BUCKET_HERE", // Replace with your Firebase Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE", // Replace with your Messaging Sender ID
  appId: "YOUR_APP_ID_HERE", // Replace with your Firebase App ID
  measurementId: "YOUR_MEASUREMENT_ID_HERE" // Optional: Replace if you use Firebase Analytics
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;