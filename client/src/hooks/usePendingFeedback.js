

import { useEffect, useState, useCallback } from "react";
import { getPendingFeedback } from "../services/feedbackServices";

export default function usePendingFeedback() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPendingFeedback();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function removeFirst() {
    setQueue((prev) => prev.slice(1));
  }

  return { queue, current: queue[0] || null, loading, refresh, removeFirst };
}