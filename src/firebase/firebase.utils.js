import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
//require('dotenv').config();

// const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
// const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

const config = {
  apiKey: "AIzaSyBgaT7_Tj8ZZLZERjP8vMVJJn0FGzKcoVo",
  authDomain: "clothing-db-61ccf.firebaseapp.com",
  databaseURL: "https://clothing-db-61ccf.firebaseio.com",
  projectId: "clothing-db-61ccf",
  storageBucket: "",
  messagingSenderId: "615782782215",
  appId: "1:615782782215:web:d367bcdd2cbb9d4e"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log("error creating user ", error.message);
    }
  }
  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
