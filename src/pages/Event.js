import QRCode from "react-qr-code";
import { auth } from "../firebase";
import { useParams } from "react-router-dom";

export default function Event(){
  const {id} = useParams();
  return(
    <div className="ticket-box">
      <h2>Your Entry Pass</h2>
      <QRCode value={auth.currentUser.uid+"_"+id}/>
    </div>
  )
}
