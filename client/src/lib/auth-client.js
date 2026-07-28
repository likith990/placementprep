
import { createAuthClient } from "better-auth/react";
import { API_BASE } from "../config.js";

export const authClient = createAuthClient({
  baseURL: API_BASE || (typeof window !== "undefined" ? window.location.origin : ""),
  fetchOptions: {
    credentials: "include",
  },
});