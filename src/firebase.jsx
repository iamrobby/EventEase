// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged} from "firebase/auth";
import { createContext,useContext,useState ,useEffect, use} from "react";
import {getFirestore,collection,addDoc,Timestamp,serverTimestamp} from "firebase/firestore"
const firebaseContext =createContext(null);


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,

};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const useFirebase= ()=> useContext(firebaseContext);
export const FirebaseProvider = (props)=>{
  const [user,setUser]=useState(null);
  useEffect(()=>{
    onAuthStateChanged(auth,user=>{
      if (user) {
    setUser(user);
  }
else{
    setUser(null);
}});
  },[])
  
  const signupUserWithEmailandPassword=(email,password)=>
    createUserWithEmailAndPassword(auth,email,password);
  
  const signinUserWithEmailandPassword=(email,password)=>
    signInWithEmailAndPassword(auth,email,password);
  
  const isloggedin=user? true:false;

  const handleNewListing=async (name,date,time)=>{
      const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const dateValue = date instanceof Date ? Timestamp.fromDate(date) : Timestamp.fromDate(new Date(date));
  await addDoc(collection(firestore, 'events'), {
    name,
    date: dateValue,
    time,
    ownerId: uid,
    createdAt: serverTimestamp()
         })
  }
  return <firebaseContext.Provider value={{ signupUserWithEmailandPassword ,signinUserWithEmailandPassword,isloggedin,handleNewListing}}>{props.children}</firebaseContext.Provider>
};