import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// require('dotenv').config();

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

const config = {
  apiKey: apiKey,
  authDomain: "clothing-db-61ccf.firebaseapp.com",
  databaseURL: dbUrl,
  projectId: "clothing-db-61ccf",
  storageBucket: "",
  messagingSenderId: "615782782215",
  appId: "1:615782782215:web:d367bcdd2cbb9d4e"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;

