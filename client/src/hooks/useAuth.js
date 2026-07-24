
import { authClient } from "../lib/auth-client";

export function useAuth() {
    const { data: session, isPending } = authClient.useSession();

    async function login() {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.origin,
        });
    }

    async function logout() {
        await authClient.signOut();
    }

    return {
        session,
        isPending,
        login,
        logout,
    };
}