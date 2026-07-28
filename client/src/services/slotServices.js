
import { API_BASE } from "../config.js";

const SLOTS_BASE = `${API_BASE}/api/slots`;


export default async function getSlots() {
    console.log("sent req from frontend")

    let results = await fetch(`${API_BASE}/api/slots/`, {
    credentials: "include",
  });

    const data= await results.json();
    console.log("i have collected data from slots")
    console.log(data);
    return data;
    
}


export async function createSlot(slotData) {
  const response = await fetch(`${API_BASE}/api/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(slotData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to create slot");
  }

  const newSlot = await response.json();
  return newSlot;
}


export async function connectToSlot(slotId, { message, resumeLink }) {
  const response = await fetch(`${API_BASE}/api/slots/${slotId}/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message, resumeLink }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to connect");
  }

  return response.json();
}



export async function getPostedSlots() {
  const res = await fetch(`${SLOTS_BASE}/mine/posted`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch posted slots");
  return res.json();
}

export async function acceptRequest(slotId, userId) {
  const res = await fetch(`${SLOTS_BASE}/${slotId}/requests/${userId}/accept`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to accept request");
  }
  return res.json();
}

export async function declineRequest(slotId, userId) {
  const res = await fetch(`${SLOTS_BASE}/${slotId}/requests/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to decline request");
  }
  return res.json();
}


export async function getRequestedSlots() {
  const res = await fetch(`${SLOTS_BASE}/mine/requested`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch requested slots");
  return res.json();
}

export async function cancelSlot(slotId) {
  const res = await fetch(`${SLOTS_BASE}/${slotId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to cancel slot");
  }
  return res.json();
}