

import { useState } from "react";

export default function PostedSlotCard({ slot, onAccept, onDecline,onCancel  }) {
  const [busyId, setBusyId] = useState(null);

  const interested = slot.requests.filter((r) => r.status === "interested");
  const booked = slot.requests.filter((r) => r.status === "booked");

  async function handleAccept(userId) {
    setBusyId(userId);
    try {
      await onAccept(slot._id, userId);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDecline(userId) {
    setBusyId(userId);
    try {
      await onDecline(slot._id, userId);
    } finally {
      setBusyId(null);
    }
  }

  const formattedTime = new Date(slot.starttime).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="posted-slot-card">
      <div className="posted-slot-header">
        <h3>{slot.title}</h3>
        <span className="posted-slot-time">{formattedTime}</span>
        <span className="posted-slot-count">{booked.length}/{slot.capacity} booked</span>
        <button
          className="decline-btn"
          onClick={() => {
            if (window.confirm("Cancel this slot? Everyone who requested it will be notified.")) {
              onCancel(slot._id);
            }
          }}
        >
          Cancel Slot
        </button>
      </div>

      <div className="posted-slot-section">
        <h4>Interested ({interested.length})</h4>
        {interested.length === 0 && <p className="posted-slot-empty">No one yet</p>}
        {interested.map((r) => (
          <div key={r.user._id} className="request-row">
            <div className="request-info">
              <div className="request-name">{r.user.username}</div>
              {r.message && <div className="request-message">"{r.message}"</div>}
              {r.resumeLink && (
                <a href={r.resumeLink} target="_blank" rel="noreferrer" className="request-resume">
                  Resume
                </a>
              )}
            </div>
            <div className="request-actions">
              <button
                disabled={busyId === r.user._id}
                className="accept-btn"
                onClick={() => handleAccept(r.user._id)}
              >
                Accept
              </button>
              <button
                disabled={busyId === r.user._id}
                className="decline-btn"
                onClick={() => handleDecline(r.user._id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="posted-slot-section">
        <h4>Booked ({booked.length})</h4>
        {booked.length === 0 && <p className="posted-slot-empty">No one yet</p>}
        {booked.map((r) => (
          <div key={r.user._id} className="request-row">
            <div className="request-info">
              <div className="request-name">{r.user.username}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}