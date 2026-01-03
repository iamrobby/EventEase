import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Event from "./pages/Event";
import Admin from "./pages/Admin";
import Scanner from "./pages/Scanner";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/event/:id" element={<Event/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/scan" element={<Scanner/>}/>
      </Routes>
    </BrowserRouter>
  );
}
