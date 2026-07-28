

import { useState } from "react";
import { submitFeedback } from "../../services/feedbackServices";
import "./FeedbackModal.css";

const RATING_FIELDS = [
  { key: "communication", label: "Communication" },
  { key: "technical", label: "Technical Knowledge" },
  { key: "problemSolving", label: "Problem Solving" },
];

export default function FeedbackModal({ pending, onDone }) {
  const [noShow, setNoShow] = useState(false);
  const [ratings, setRatings] = useState({ communication: 0, technical: 0, problemSolving: 0 });
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setRating(key, value) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!noShow && (!ratings.communication || !ratings.technical || !ratings.problemSolving)) {
      setError("Please rate all three categories, or mark this as a no-show.");
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        slotId: pending.slotId,
        toUserId: pending.toUser._id,
        noShow,
        ratings: noShow ? undefined : ratings,
        comment,
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feedback-overlay">
      
      <div className="feedback-modal">
        <h2>Feedback for {pending.toUser.username}</h2>
        <p className="feedback-subtitle">"{pending.slotTitle}"</p>

        <form onSubmit={handleSubmit}>
          <label className="feedback-noshow">
            <input
              type="checkbox"
              checked={noShow}
              onChange={(e) => setNoShow(e.target.checked)}
            />
            This session didn't happen (no-show)
          </label>

          {!noShow && (
            <div className="feedback-ratings">
              {RATING_FIELDS.map(({ key, label }) => (
                <div key={key} className="feedback-rating-row">
                  <span className="feedback-rating-label">{label}</span>
                  <div className="feedback-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`feedback-star ${ratings[key] >= n ? "filled" : ""}`}
                        onClick={() => setRating(key, n)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="feedback-comment-label">
            {noShow ? "What happened? (optional)" : "Anything else? (optional)"}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder={noShow ? "e.g. they never joined the call" : "Notes on communication, technical depth, etc."}
            />
          </label>

          {error && <p className="feedback-error">{error}</p>}

          <button type="submit" className="feedback-submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}