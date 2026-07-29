
import { useEffect, useState, useCallback } from "react";
import { getRequestedSlots } from "../services/slotServices";

export default function useRequestedSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRequestedSlots();
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  queueMicrotask(refresh);
}, [refresh]);

  return { slots, loading, refresh };
}