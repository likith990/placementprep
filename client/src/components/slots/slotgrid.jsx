import { lazy, Suspense } from "react";
import "./Slotgrid.css";
import SlotCard from "./SlotCard";
import useSlots from "../../hooks/useSlots";
import Loader from "../ui/Loader";
const CreateSlotDialog = lazy(() => import("./CreateSlotDialog"));

export default function SlotGrid({ onViewProfile }) {
  const { slots, addSlot, updateMyRequest, cancelBooking,loading } = useSlots();

  return (
    <>
      <Suspense fallback={null}>
        <CreateSlotDialog onSlotCreated={addSlot} />
      </Suspense>
      {loading ? (
        <Loader label="Loading available slots..." />
      ) : (
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
      )}
    </>
  );
}
