import Navbar from "../components/Navbar";

export default function Admin(){
  return(
    <>
      <Navbar/>
      <div className="admin-box">
        <h2>Admin Panel</h2>
        <a href="/scan"><button>Start Entry Scan</button></a>
      </div>
    </>
  )
}
