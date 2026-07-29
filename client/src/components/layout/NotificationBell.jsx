

import { useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import "./NotificationBell.css";
import useNow from "../../hooks/useNow";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount,  markAllRead } = useNotifications();
  const now = useNow();

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) markAllRead();
  }

  function formatTime(dateStr) {
   const diffMs = now - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={toggleOpen}>
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-header">Notifications</div>
          {notifications.length === 0 ? (
            <div className="notif-empty">Nothing yet</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`}>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{formatTime(n.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}