import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATmvE2gvI_wd0c4Wak-Kv-6qZziejGzOo",
  authDomain: "my-projest-737c5.firebaseapp.com",
  projectId: "my-projest-737c5",
  storageBucket: "my-projest-737c5.appspot.com",
  messagingSenderId: "896878263508",
  appId: "1:896878263508:web:70cba88e0abb509f7c0f41",
  measurementId: "G-9KN2X6JN67"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

// export const createUserProfileDocument = async (userAuth, additionalData) => {
//     if (!userAuth) return;

//     console.log(userAuth);
//   };

export const auth = getAuth();
export const signInWithGooglePopup = async () => {
  try {
    await signInWithPopup(auth, provider);
    localStorage.setItem("username", JSON.stringify(auth));
    // Navigate('/home')

    console.log("auth", auth);

    console.log("Provider,", provider);
  } catch (err) {
    console.log("error with sigin google", err.message);
  }
};

//firbase database
export const db = getFirestore();

// manually User add in the Form
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    console.log("====>", displayName, email);
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

//Sign in With Email and Password which is stord in FireDatabase

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

//sign out user

export const signOutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
  // console.log("callbackfunction",callback)
};
