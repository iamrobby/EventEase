import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import SignOut from './signOut';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import Button from 'react-bootstrap/Button'
import { app } from '../firebase';
import { useNavigate,useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const auth=getAuth(app);


function MyNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const disableSignOut = location.pathname === '/login';
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="py-2">
  <Container>
    <Navbar.Brand as={Link} to="/">EventEase</Navbar.Brand>

    {/* Mobile toggle */}
    <Navbar.Toggle aria-controls="main-navbar" />

    <Navbar.Collapse id="main-navbar">
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/events" disabled={disableSignOut}>Events</Nav.Link>
        <Nav.Link as={Link} to="/addevents" disabled={disableSignOut}>Add Events</Nav.Link>
        <Nav.Link
          href="https://eventease-k8qrjaelwqv2qeqqd5yaqb.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          disabled={disableSignOut}
        >
          ReportGen
        </Nav.Link>
      </Nav>

      {/* Right aligned buttons */}
      <Nav className="ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
        {user ? (
          <Button
            variant="outline-danger"
            disabled={disableSignOut}
            onClick={() => {
              signOut(auth)
                .then(() => navigate('/login'))
                .catch(console.error);
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="outline-success"
            onClick={() => navigate('/register')}
          >
            Sign In
          </Button>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      </>
  );
}

export default MyNavbar
