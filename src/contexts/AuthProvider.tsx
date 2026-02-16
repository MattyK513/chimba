import { createContext, useEffect, useState } from "react";
import { subscribeToAuthState } from "../services/auth";
import type { AuthStateType, UserInfo } from "../types/firebase";
import type { ReactNode } from "../types/react";

export const AuthStateContext= createContext<AuthStateType>({
    loading: null,
    user: null
});

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

    return (
        <AuthStateContext.Provider value={{ loading, user}}>
            {children}
        </AuthStateContext.Provider>
    )
};