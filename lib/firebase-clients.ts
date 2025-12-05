import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmQ8T_WrkY04C0IIUk3zezhDk-ASNa-Vo",
  authDomain: "kostmunity-62656.firebaseapp.com",
  projectId: "kostmunity-62656",
  storageBucket: "kostmunity-62656.firebasestorage.app",
  messagingSenderId: "358249762465",
  appId: "1:358249762465:web:0651797e473ba672fc6ae0",
  measurementId: "G-KVC8082BWR"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
