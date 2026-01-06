import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in .env');
}
const genAI = new GoogleGenerativeAI(API_KEY);

export default function EventDetails({ show, event, onClose }) {
  const [instagram, setInstagram] = useState('');
  const [prompt, setPrompt] = useState('');
  const [writeup, setWriteup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateWriteup = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for writeup generation');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const fullPrompt = `Event: ${event.name} on ${event.date?.toLocaleDateString()} at ${event.time}\n\nUser prompt: ${prompt}`;
      const result = await model.generateContent(`Write Instagram + LinkedIn post for ${fullPrompt}`);
      setWriteup(result.response.text());
    } catch (err) {
      setError('Failed to generate writeup: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!writeup.trim()) {
      setError('Generate a writeup first');
      return;
    }
    try {
      await navigator.clipboard.writeText(writeup);
      alert('Writeup copied to clipboard!');
    } catch (err) {
      setError('Failed to copy: ' + err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{event?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Instagram Handle</Form.Label>
            <Form.Control
              type="text"
              placeholder="@yourinstagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Custom Prompt for Writeup</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="e.g., Create a fun Instagram caption with emojis and hashtags"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="info"
            onClick={generateWriteup}
            disabled={loading}
            className="mb-3"
          >
            {loading ? <Spinner size="sm" /> : 'Generate AI Writeup'}
          </Button>
          {writeup && (
            <Form.Group className="mb-3">
              <Form.Label>Generated Writeup</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={writeup}
                onChange={(e) => setWriteup(e.target.value)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleCopy} disabled={!writeup}>Copy Writeup</Button>
      </Modal.Footer>
    </Modal>
  );
}