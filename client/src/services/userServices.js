
import { API_BASE } from "../config.js";
const USERS_BASE = `${API_BASE}/api/users`;


export default async function getCurrUser() {
  console.log("running get user");

 let result = await fetch(`${API_BASE}/api/users/me`, {
    credentials: "include",
  });

  const data = await result.json();

  return data.user;
}

export async function getUserProfile(userId) {
  const res = await fetch(`${USERS_BASE}/${userId}/profile`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateMyProfile(data) {
  const res = await fetch(`${USERS_BASE}/me/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to update profile");
  }
  return res.json();
}