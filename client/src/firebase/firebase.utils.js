import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBgaT7_Tj8ZZLZERjP8vMVJJn0FGzKcoVo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "clothing-db-61ccf.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://clothing-db-61ccf.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "clothing-db-61ccf",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "clothing-db-61ccf.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "615782782215",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:615782782215:web:d367bcdd2cbb9d4e"
};

const app = initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const firestore = getFirestore(app);
  const userRef = doc(firestore, `users/${userAuth.uid}`);

  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
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

// utility function to add data to Firestore. Add to App.js and run once to upload items to store
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const firestore = getFirestore(app);
  const collectionRef = collection(firestore, collectionKey);
  console.log(collectionRef);

  const batch = writeBatch(firestore);
  objectsToAdd.forEach(obj => {
    const newDocRef = doc(collectionRef);
    batch.set(newDocRef, obj);
  });
  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    };
  });
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export default app;
