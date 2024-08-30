require("dotenv").config();
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "registros-7817f.firebaseapp.com",
  projectId: "registros-7817f",
  storageBucket: "registros-7817f.appspot.com",
  messagingSenderId: "864967032578",
  appId: "1:864967032578:web:6a678a3a0a67c81ca20c1b"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
export const firestoreDB = firebase.firestore();
export const auth = firebase.auth();