require("dotenv").config();
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: process.env.API_KEY,
  authDomain: "registros-7817f.firebaseapp.com",
  projectId: "registros-7817f",
  storageBucket: "registros-7817f.appspot.com",
  messagingSenderId: "864967032578",
  appId: "1:864967032578:web:6a678a3a0a67c81ca20c1b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const firestoreDB = app.firestore();
