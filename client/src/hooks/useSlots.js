
import { useEffect, useState } from "react";
import getSlots from "../services/slotServices";
import { declineRequest } from "../services/slotServices";
import { useUser } from "./useUsers";

export default function useSlots() {
  const [slots, setSlots] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    async function fetchSlots() {
      const data = await getSlots();
      setSlots(data);
    }
    fetchSlots();
  }, []);

  function addSlot(newSlot) {
    setSlots((prev) => [newSlot, ...prev]);
  }

  function updateMyRequest(slotId, myRequest) {
    setSlots((prev) =>
      prev.map((s) =>
        s._id === slotId
          ? { ...s, myRequest, interestedCount: (s.interestedCount || 0) + 1 }
          : s
      )
    );
  }

  async function cancelBooking(slotId) {
    if (!user) return;
    try {
      await declineRequest(slotId, user._id);
      setSlots((prev) =>
        prev.map((s) =>
          s._id === slotId
            ? { ...s, myRequest: null, bookedCount: Math.max((s.bookedCount || 1) - 1, 0) }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  return { slots, addSlot, updateMyRequest, cancelBooking };
}