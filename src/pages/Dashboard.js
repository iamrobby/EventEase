import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";

export default function Dashboard(){
  const [events,setEvents] = useState([]);

  useEffect(()=>{
    const load = async()=>{
      const snap = await getDocs(collection(db,"events"));
      setEvents(snap.docs.map(d=>({id:d.id,...d.data()})));
    };
    load();
  },[]);

  return(
    <>
    <Navbar/>
    <div className="event-grid">
      {events.map(e=><EventCard key={e.id} event={e}/>)}
    </div>
    </>
  )
}
