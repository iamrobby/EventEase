import React from 'react'
import {Routes,Route} from "react-router-dom"
import { getAuth , onAuthStateChanged,signOut} from "firebase/auth";
import {getDatabase,ref,set} from "firebase/database";
import { useEffect,useState } from 'react';
import {app}from "./firebase";
import { getFirestore,collection, addDoc } from "firebase/firestore";
import Signuppage from './pages/signup';
import Signin from './pages/Signin';
import "bootstrap/dist/css/bootstrap.min.css"
import MyNavbar from './components/Navbar';
import "./App.css";
import ListEvent from './pages/ListEvent';
import EventsPage from './pages/Events';
import Homepage from './pages/Homepage';
// const auth=getAuth(app);
// const firestore=getFirestore(app);
function App(){

      return (
        <div>
          <MyNavbar/>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/register" element={<Signuppage />} />
      <Route path="/login" element={<Signin/>} />
      <Route path="/events" element={<EventsPage/>} />
      <Route path="/addevents" element={<ListEvent/>} />
    </Routes>
    </div>
  
    
  // return (
  //   <div className='App'>
  //       <h1>Hello {user.email}</h1>
  //       <button onClick={()=>signOut(auth)}>signout</button>
  //   </div>
      );
}

export default App
