

import { API_BASE } from "../config.js";

const FEEDBACK_BASE = `${API_BASE}/api/feedback`;

export async function getPendingFeedback() {
  const res = await fetch(`${FEEDBACK_BASE}/pending`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch pending feedback");
  return res.json();
}

export async function submitFeedback({ slotId, toUserId, noShow, ratings, comment }) {
  const res = await fetch(FEEDBACK_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slotId, toUserId, noShow, ratings, comment }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to submit feedback");
  }
  return res.json();
}

export async function getUserFeedback(userId) {
  const res = await fetch(`${FEEDBACK_BASE}/user/${userId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user feedback");
  return res.json();
}