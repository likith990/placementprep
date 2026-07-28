

import { API_BASE } from "../config.js";

const BASE = `${API_BASE}/api/notifications`;

export async function getNotifications() {
  const res = await fetch(BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${BASE}/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${BASE}/read-all`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}