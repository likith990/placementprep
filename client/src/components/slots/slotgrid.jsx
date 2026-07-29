import { lazy, Suspense } from "react";
import "./Slotgrid.css";
import SlotCard from "./SlotCard";
import useSlots from "../../hooks/useSlots";
const CreateSlotDialog = lazy(() => import("./CreateSlotDialog"));

export default function SlotGrid({ onViewProfile }) {
  const { slots, addSlot, updateMyRequest, cancelBooking } = useSlots();

  return (
    <>
      <Suspense fallback={null}>
        <CreateSlotDialog onSlotCreated={addSlot} />
      </Suspense>
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
