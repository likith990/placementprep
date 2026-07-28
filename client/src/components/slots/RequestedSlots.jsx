
import { useState } from "react";
import useRequestedSlots from "../../hooks/useRequestedSlots";
import { declineRequest } from "../../services/slotServices";
import { useUser } from "../../hooks/useUsers";
import "./PostedSlotCard.css";

const STATUS_LABEL = {
  interested: "Pending",
  booked: "Booked",
};

const STATUS_CLASS = {
  interested: "status-pending",
  booked: "status-booked",
};

export default function RequestedSlots() {
  const { slots, loading, refresh } = useRequestedSlots();
  const { user } = useUser();
  const [cancellingId, setCancellingId] = useState(null);

  if (loading) return <p className="posted-slot-empty">Loading...</p>;
  if (slots.length === 0) return <p className="posted-slot-empty">You haven't requested any slots yet</p>;

  async function handleCancel(slotId) {
    setCancellingId(slotId);
    try {
      await declineRequest(slotId, user._id);
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div>
      {slots.map((slot) => {
        const status = slot.myRequest?.status;
        const hasStarted = new Date(slot.starttime).getTime() <= Date.now();
        const formattedTime = new Date(slot.starttime).toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        return (
          <div key={slot._id} className="posted-slot-card">
            <div className="posted-slot-header">
              <h3>{slot.title}</h3>
              <span className="posted-slot-time">{formattedTime}</span>
              <span className={STATUS_CLASS[status] || ""}>{STATUS_LABEL[status] || status}</span>
            </div>
            <p className="posted-slot-empty">with {slot.interviewer?.username || "Unassigned"}</p>

            {status === "booked" && hasStarted && slot.meetinglink && (
              <a href={slot.meetinglink} target="_blank" rel="noreferrer" className="request-resume">
                Join meeting
              </a>
            )}

            {status === "booked" && !hasStarted && (
              <div className="request-booked-actions">
                <button className="request-booked-label" disabled>
                  You're booked
                </button>
                <button
                  className="request-cancel-btn"
                  onClick={() => handleCancel(slot._id)}
                  disabled={cancellingId === slot._id}
                >
                  {cancellingId === slot._id ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}