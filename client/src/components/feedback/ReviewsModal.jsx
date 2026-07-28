

import { useEffect, useState } from "react";
import { getUserFeedback } from "../../services/feedbackServices";
import "./ReviewsModal.css";

function StarDisplay({ value }) {
  if (value === null) return <span className="reviews-no-data">No ratings yet</span>;
  return (
    <span className="reviews-stars">
      {"★".repeat(Math.round(value))}
      {"☆".repeat(5 - Math.round(value))}
      <span className="reviews-value"> {value.toFixed(1)}</span>
    </span>
  );
}

export default function ReviewsModal({ userId, username, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getUserFeedback(userId);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  return (
    <div className="reviews-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reviews-header">
          <h2>{username}'s Reviews</h2>
          <button className="reviews-close-btn" onClick={onClose}>×</button>
        </div>

        {loading && <p className="reviews-empty">Loading...</p>}

        {!loading && data && (
          <>
            <div className="reviews-summary">
              <div className="reviews-summary-row">
                <span>Communication</span>
                <StarDisplay value={data.averages.communication} />
              </div>
              <div className="reviews-summary-row">
                <span>Technical</span>
                <StarDisplay value={data.averages.technical} />
              </div>
              <div className="reviews-summary-row">
                <span>Problem Solving</span>
                <StarDisplay value={data.averages.problemSolving} />
              </div>
              <p className="reviews-count">{data.count} review{data.count === 1 ? "" : "s"}</p>
            </div>

            <div className="reviews-list">
              {data.feedback.length === 0 && (
                <p className="reviews-empty">No written feedback yet</p>
              )}
              {data.feedback
                .filter((f) => f.comment)
                .map((f) => (
                  <div key={f._id} className="reviews-item">
                    <div className="reviews-item-header">
                      <span className="reviews-item-author">{f.fromUser?.username || "Anonymous"}</span>
                      <span className="reviews-item-date">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="reviews-item-comment">{f.comment}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}