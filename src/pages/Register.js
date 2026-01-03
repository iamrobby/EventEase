import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const register = async ()=>{
    try{
      await createUserWithEmailAndPassword(auth,email,password);
      nav("/dashboard");
    }catch(err){
      alert(err.message);
    }
  };

  return(
    <div className="auth-box">
      <h2>Register</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={register}>Create Account</button>
      <p>Already registered? <Link to="/">Login</Link></p>
    </div>
  )
}
