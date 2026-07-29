
import { useContext } from "react";
import { UserContext } from "../context/UserContextObject";
export function useUser() {
    return useContext(UserContext);
}