import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

function MailForm() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5001/send-mail", formData);
      if (res.data.success) {
        setStatus("✅ Email sent successfully!");
        setFormData({ to: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send email");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error sending email");
    }
  };

  return (
    <div className=" boot">
      {/* Mail Button */}
      <Button variant="primary mt-5 " onClick={() => setShow(true)}>
        📧 Send Mail
      </Button>

      {/* Popup Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Compose Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="to"
                placeholder="Recipient Email"
                value={formData.to}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Send
            </Button>
          </Form>
          {status && <p className="mt-2">{status}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MailForm;
