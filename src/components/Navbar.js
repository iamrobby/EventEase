import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar(){
  return(
    <div className="navbar">
      <h2>Campus Event Platform</h2>
      <button onClick={()=>signOut(auth)}>Logout</button>
    </div>
  )
}
