import React from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Homepage = () => {
  return (
    <div className="homepage-root">
      <section className="homepage-hero text-light d-flex align-items-center">
        <Container>
          <Row className="align-items-center mt-5">
            <Col md={30} lg={20}>
                  <h1 className="display-4 fw-bold hero-title">EventEase — Create, Share, and Shine</h1>
                  <p className="lead text-light hero-lead">An AI-powered orchestration workspace that manages the entire event lifecycle across existing platforms.</p>
                  <div className="mt-4">
                    <Button as={Link} to="/events" variant="light" className="me-2 hero-cta">Browse Events</Button>
                    <Button as={Link} to="/addevents" variant="outline-light" className="hero-cta">Create Event</Button>
                  </div>
            </Col>
            {/* <Col md={5} className="d-none d-md-block">
              <Card className="shadow-lg bg-transparent border-0">
                <Card.Body>
                  <div className="mock-phone mx-auto text-light">
                        <div className="mock-screen p-3 mock-animate">
                      <h5 className="mb-1">Community Meetup</h5>
                      <small className="text-light">Mar 12 • 6:30 PM</small>
                      <p className="mt-2 mb-0">Join us for a night of networking and coffee. #meetup #community</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="mb-4 text-center">Why organizers love EventEase</h2>
          <Row className="g-4">
            <Col md={4}>
                  <Card className="h-100 feature-card text-center feature-animate">
                <Card.Body>
                  <h5>Private by default</h5>
                  <p className="text-muted">Only you can edit or delete your events — enforced by secure Firestore rules.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
                  <Card className="h-100 feature-card text-center feature-animate">
                <Card.Body>
                  <h5>AI-powered writeups</h5>
                  <p className="text-muted">Generate catchy Instagram captions using the integrated AI assistant and tweak them before posting.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
                  <Card className="h-100 feature-card text-center feature-animate">
                <Card.Body>
                  <h5>Quick event creation</h5>
                  <p className="text-muted">Create an event in seconds and share details with your audience.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/addevents" variant="dark">Get Started — Create an Event</Button>
          </div>
        </Container>
      </section>

      <footer className="py-4 bg-light mt-5">
        <Container className="text-center text-muted">
          © {new Date().getFullYear()} EventEase • Built with ❤️
        </Container>
      </footer>
    </div>
  )
}

export default Homepage
