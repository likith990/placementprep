

import { useEffect, useState, useCallback } from "react";
import { getPostedSlots, acceptRequest, declineRequest,cancelSlot } from "../services/slotServices";

export default function usePostedSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPostedSlots();
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function accept(slotId, userId) {
    await acceptRequest(slotId, userId);
    await refresh();
  }

  async function decline(slotId, userId) {
    await declineRequest(slotId, userId);
    await refresh();
  }

  async function cancel(slotId) {
  await cancelSlot(slotId);
  await refresh();
}

  return { slots, loading, accept, decline,cancel, refresh };
}

