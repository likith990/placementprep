

import usePostedSlots from "../../hooks/usePostedSlots";
import PostedSlotCard from "./PostedSlotCard";
import "./PostedSlotCard.css";

export default function PostedSlots() {
  const { slots, loading, accept, decline,cancel } = usePostedSlots();

  if (loading) return <p className="posted-slot-empty">Loading...</p>;
  if (slots.length === 0) return <p className="posted-slot-empty">You haven't posted any slots yet</p>;

  return (
    <div>
      {slots.map((slot) => (
        <PostedSlotCard key={slot._id} slot={slot} onAccept={accept} onDecline={decline}  onCancel={cancel} />
      ))}
    </div>
  );
}