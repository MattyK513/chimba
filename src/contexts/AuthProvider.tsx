import { createContext, useEffect, useMemo, useState } from "react";
import { subscribeToAuthState } from "../services/auth";
import type { AuthStateType, ReactNode, UserInfo } from "../types";

export const AuthStateContext = createContext<AuthStateType | null>(null);

export default function AuthProvider({ children }: {children: ReactNode}) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((newUser) => {
            setUser(newUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = useMemo(
        () => ({ loading, user }),
        [loading, user]
    );

    return (
        <AuthStateContext.Provider value={value}>
            {children}
        </AuthStateContext.Provider>
    )
};