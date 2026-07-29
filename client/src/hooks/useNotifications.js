

import { useEffect, useState, useCallback } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationServices";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
  queueMicrotask(refresh);
  const interval = setInterval(refresh, 30000);
  return () => clearInterval(interval);
}, [refresh]);

  async function markRead(id) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  async function markAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  return { notifications, unreadCount, markRead, markAllRead };
}