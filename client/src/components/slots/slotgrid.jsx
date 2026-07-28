
import "./SlotGrid.css";
import SlotCard from "./SlotCard";
import useSlots from "../../hooks/useSlots";
import CreateSlotDialog from "./CreateSlotDialog";

export default function SlotGrid({ onViewProfile }) {
  const { slots, addSlot, updateMyRequest, cancelBooking } = useSlots();

  return (
    <>
      <CreateSlotDialog onSlotCreated={addSlot} />
      <div className="slot-grid">
        {slots.map((slot) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            onConnected={updateMyRequest}
            onCancel={cancelBooking}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    </>
  );
}