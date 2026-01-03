import { Link } from "react-router-dom";

export default function EventCard({event}){
  return(
    <div className="card">
      <h3>{event.name}</h3>
      <p>{event.fee === 0 ? "Free" : "₹"+event.fee}</p>
      <Link to={`/event/${event.id}`}><button>Register</button></Link>
    </div>
  )
}
