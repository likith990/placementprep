

import usePostedSlots from "../../hooks/usePostedSlots";
import PostedSlotCard from "./PostedSlotCard";
import "./PostedSlotCard.css";
import Loader from "../ui/Loader";

export default function PostedSlots() {
  const { slots, loading, accept, decline,cancel } = usePostedSlots();

   if (loading) return <Loader label="Loading your slots..." />;
  if (slots.length === 0) return <p className="posted-slot-empty">You haven't posted any slots yet</p>;

  return (
    <div>
      {slots.map((slot) => (
        <PostedSlotCard key={slot._id} slot={slot} onAccept={accept} onDecline={decline}  onCancel={cancel} />
      ))}
    </div>
  );
}