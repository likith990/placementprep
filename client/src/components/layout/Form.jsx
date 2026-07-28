
import { useState } from "react";
import { createSlot } from "../../services/slotServices";
import "./Form.css";

export default function Form({ onClose, onSlotCreated }) {
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [starttime, setStarttime] = useState("");
  const [duration, setDuration] = useState(60);
  const [meetinglink, setMeetinglink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const newSlot = await createSlot({
        title,
        capacity: Number(capacity),
        starttime,
        duration: Number(duration),
        meetinglink,
      });
      onSlotCreated(newSlot);
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
        <h2>Create Slot</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Capacity
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </label>

          <label>
            Start Time
            <input
              type="datetime-local"
              value={starttime}
              onChange={(e) => setStarttime(e.target.value)}
              required
            />
          </label>

          <label>
            Duration
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            >
              <option value={3}>3 min (test)</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
              <option value={120}>120 min</option>
            </select>
          </label>

          <label>
            Meeting Link
            <input
              type="url"
              value={meetinglink}
              onChange={(e) => setMeetinglink(e.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}