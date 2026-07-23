
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://placementprep-3m4y.onrender.com",
  fetchOptions: {
    credentials: "include",
  },
});