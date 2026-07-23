import { useState } from "react";
import { useEffect } from "react";
import { authClient } from "./lib/auth-client";

function App() {
  useEffect(() => {
    async function test() {
      let response = await fetch("http://localhost:8080/api/test");
      let data = await response.json();
      console.log(data);
    }
    test();
  }, []);

  const { data: session } = authClient.useSession();
  console.log(session);

  async function login() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173",
    });
  }

  async function logout() {
    await authClient.signOut();
  }

  return (
    <>
      {!session && <button onClick={login}>Login with Google</button>}
      <p>{session ? "Logged In" : "Not Logged In"}</p>
      {session && <button onClick={logout}>logout</button>}
    </>
  );
}

export default App;
