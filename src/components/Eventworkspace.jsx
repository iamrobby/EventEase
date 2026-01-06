import React, { useState } from "react";
import { Row, Col, Form, Button, Spinner, Card, Alert } from "react-bootstrap";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function EventWorkspace({ event }) {
  const [canvas, setCanvas] = useState(
`# ${event.name}

Date: ${event.date}
Time: ${event.time}

## Event Notes
`
  );

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAndInsert = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fullPrompt = `
You are an event management assistant.
Event: ${event.name}
Date: ${event.date}
Time: ${event.time}

Task:
${prompt}

Return clean markdown that can be inserted into a Notion-like document.
`;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
    const processed = text.replace(/(https?:\/\/\S+\.(?:png|jpe?g|gif|webp))/gi, '![]($1)');

      setCanvas(prev => `${prev}\n\n${text}`);
    } catch (err) {
      setError("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="mt-4" style={{ height: "85vh" }}>
      {/* LEFT: NOTION CANVAS */}
      <Col md={8} className="h-100">
        <Card className="h-100">
          <Card.Header>Event Workspace</Card.Header>
          <Card.Body>
            <Form.Control
              as="textarea"
              value={canvas}
              onChange={(e) => setCanvas(e.target.value)}
              style={{
                height: "100%",
                fontFamily: "monospace",
                fontSize: "14px"
              }}
            />
            <Card>
              <Card.Header>Preview</Card.Header>
              <Card.Body style={{ overflowY: "auto", maxHeight: "40vh" }}>
                <ReactMarkdown>{canvas}</ReactMarkdown>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Col>

      {/* RIGHT: AI AGENT */}
      <Col md={4} className="h-100">
        <Card className="h-100">
          <Card.Header>AI Event Agent</Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group>
              <Form.Label>Tell AI what to add</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="e.g. Create Instagram + LinkedIn promo copy with hashtags"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </Form.Group>

            <Button
              className="mt-3 w-100"
              onClick={generateAndInsert}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Generate & Insert"}
            </Button>

            <hr />

            <small className="text-muted">
              AI output is appended directly to the workspace.
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
