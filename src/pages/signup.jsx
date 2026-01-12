import React, { useState,useEffect } from 'react'
import { getAuth ,createUserWithEmailAndPassword } from 'firebase/auth'
import { app } from '../firebase'
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../firebase';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// const auth=getAuth();
const Signuppage = () => {
//     const [email ,setEmail]=useState('');
//     const [password ,setPassword]=useState('');
//     const createUser=async(e)=>{
//       e.preventDefault();
     const nav=useNavigate();

    const firebase =useFirebase();
        const [email ,setEmail]=useState('');
    const [password ,setPassword]=useState('');
    useEffect(()=>{
              if(firebase.isloggedin)
              {
                  nav("/");
              }
            },[firebase ,nav])
    
    
    const createUser=async(e)=>{
      e.preventDefault();
      console.log("signing up user");
      await firebase.signupUserWithEmailandPassword(email,password);
    };
  return (
    <Form onSubmit={createUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onChange={(e)=>{setEmail(e.target.value)}} value={email} type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange ={ (e)=> {setPassword (e.target.value)}} value={password} type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create Account
      </Button>
    </Form>
  )
}

export default Signuppage
