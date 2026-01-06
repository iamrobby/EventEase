import React,{useState,useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Card, Container } from 'react-bootstrap';
import { useFirebase } from '../firebase';
const ListEvent = () => {
  const firebase=useFirebase();
    const [name,setName]=useState('');
    const [date,setDate]=useState('');
    const [time,setTime]=useState('')
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
      const datetime = new Date(`${date}T${time}`);
      if (isNaN(datetime)) throw new Error('Invalid date or time');
       await firebase.handleNewListing(name, datetime, time);
      setName(''); setDate(''); setTime('');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create event');
    }
    }
  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '500px', margin: '0 auto', backgroundColor:'pink' }}>
        <Card.Header>
          <Card.Title>Create Event</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEvent">
              <Form.Label>Event Name</Form.Label>
              <Form.Control onChange={(e)=>{setName(e.target.value)}} value={name} type="text" placeholder="Enter Event" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDate">
              <Form.Label>Set Date</Form.Label>
              <Form.Control onChange ={ (e)=> {setDate (e.target.value)}} value={date} type="date" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTime">
              <Form.Label>Set time</Form.Label>
              <Form.Control onChange ={ (e)=> {setTime (e.target.value)}} value={time} type="time" />
            </Form.Group>
            <Button variant="outline-dark" type="submit">
              Create Event
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ListEvent
