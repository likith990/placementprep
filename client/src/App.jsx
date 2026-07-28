import { useState } from "react";
import { useEffect } from "react";
import { authClient } from "./lib/auth-client";
import { API_BASE } from "./config.js";
import { useContext } from "react";
import { UserContext } from "./context/userContext";

import LandingPage from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import getCurrUser from "./services/userServices";

function App() {
  // const { data: session } = authClient.useSession();
  // console.log(session);

  // async function login() {
  //   await authClient.signIn.social({
  //     provider: "google",
  //     // callbackURL: window.location.origin, turn it on when you depoly and delete everythign below this
  //     callbackURL: "http://localhost:5173",
  //   });
  // }

  // async function logout() {
  //   await authClient.signOut();
  // }

  // return (
  //   <>
  //     {!session && <button onClick={login}>Login with Google</button>}
  //     <p>{session ? "Logged In" : "Not Logged In"}</p>
  //     {session && <button onClick={logout}>logout</button>}

  //   </>
  // );

  const { session, login, logout, isPending } = useAuth();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (!session) return;

    async function syncUser() {
      await fetch(`${API_BASE}/api/users/sync`, {
        method: "POST",
        credentials: "include",
      });

      let userdata = await getCurrUser();
      setUser(userdata);
    }

    syncUser();
  }, [session]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <LandingPage login={login} />;
  }

  return <Dashboard session={session} logout={logout} />;
}

export default App;
