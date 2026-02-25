import { useContext } from "react";
import { AuthStateContext } from "../contexts/AuthProvider";
import authFunctions from "../services/auth";

export default function useAuth() {
    const context = useContext(AuthStateContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return { ...context, ...authFunctions};
};