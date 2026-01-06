import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import Button from 'react-bootstrap/Button'
import { app } from '../firebase';

const auth=getAuth(app);
const SignOut = ({ onSignedOut }) => {
  const handleSignOut = async () => {
    try {
      await signOut(getAuth())
      if (onSignedOut) onSignedOut()
    } catch (err) {
      console.error(err)
      alert('Failed to sign out')
    }
  }

  return (
    <Button variant="outline-danger" onClick={()=>signOut(auth)}>
      Sign Out
    </Button>
  )
}

export default SignOut