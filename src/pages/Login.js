import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const login = async ()=>{
    try{
      await signInWithEmailAndPassword(auth,email,password);
      nav("/dashboard");
    }catch(err){
      alert(err.message);
    }
  };

  return(
    <div className="auth-box">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={login}>Login</button>
      <p>New user? <Link to="/register">Register</Link></p>
    </div>
  )
}
