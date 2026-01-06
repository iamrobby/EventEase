import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { collection, onSnapshot, query, orderBy ,doc, deleteDoc} from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from 'react-bootstrap/Button';
import EventDetails from './Genai';
import EventWorkspace from './Eventworkspace';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, u => setUser(u));
  return () => unsub();
}, []);
  useEffect(() => {
    const q = query(collection(firestore, 'events'), orderBy('date', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEvents(
          snap.docs.map((doc) => {
            const data = doc.data();
            const date = data.date && data.date.toDate ? data.date.toDate() : data.date ? new Date(data.date) : null;
            return { id: doc.id, ...data, date };
          })
        );
        setLoading(false);
      },
      (err) => {
        console.error('EventsList onSnapshot error:', err);
        setLoading(false);
      }
    );
    

    return () => unsub();
  }, []);
    const handleDelete = async (eventId) => {
      // client-side safety: only allow owner to trigger delete
      const ev = events.find(e => e.id === eventId);
      if (!user || !ev || user.uid !== ev.ownerId) {
        alert('You are not authorized to delete this event');
        return;
      }
      try {
        await deleteDoc(doc(firestore, 'events', eventId));
        console.log('Event deleted successfully');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event');
      }
  };
  
  const handleDetailsClick = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };


  if (loading) return (
    <div className="d-flex justify-content-center my-4">
      <Spinner animation="border" />
    </div>
  );

  return (
    <>
    <Container className="mt-4 ">
      <Row className="g-3">
        {events.length === 0 && <p className="m-3">No events yet.</p>}
        {events.map((ev) => (
          <Col key={ev.id} xs={12} md={6} lg={4}>
            <Card>
              <Card.Body>
                <Card.Title>{ev.name || 'Unnamed event'}</Card.Title>
                <Card.Text>
                  {ev.date ? ev.date.toLocaleDateString() : 'No date set'}
                </Card.Text>
                {ev.time && <Card.Text className="text-muted">Time: {ev.time}</Card.Text>}
                {user && user.uid === ev.ownerId ? (
                  <>
                    <Button className="m-2" variant="primary" onClick={() => handleDetailsClick(ev)}>workspace</Button>
                    <Button onClick={() => handleDelete(ev.id)} variant="danger">Delete</Button>
                  </>
                ) : (
                  <small className="text-muted">Private</small>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    {selectedEvent && (
        <EventWorkspace  event={selectedEvent} onClose={() => setShowDetails(false)} />
      )}
      </>
  );
}
