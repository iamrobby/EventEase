import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function Scanner(){
  useEffect(()=>{
    const scanner = new Html5QrcodeScanner("reader",{fps:10,qrbox:250});
    scanner.render(text=>alert("Entry Verified: "+text));
  },[]);

  return <div id="reader"></div>;
}
