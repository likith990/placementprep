

import { useState } from "react";
import { connectToSlot } from "../../services/slotServices";
import "../layout/Form.css";

export default function ConnectForm({ slotId, onClose, onConnected }) {
  const [message, setMessage] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await connectToSlot(slotId, { message, resumeLink });
      onConnected();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>Connect</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Short message
            <input
              type="text"
              placeholder="Why do you want to join?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <label>
            Resume / LinkedIn link
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}