import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { subscribeToGoals } from "../services/firestore";
import type { Goal, ModuleName, ReactNode, SubState, UserDataContextType } from "../types";

export const UserDataContext = createContext<UserDataContextType | null>(null);

const initialSubState: SubState = {
    goals: {
        count: 0,
        unsubscribe: null
    }
};

export default function UserDataContextProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[] | null>(null);

    const subStateRef = useRef<SubState>(structuredClone(initialSubState));

    const subscriptionDefinitions = {
        goals: {
            setState: setGoals,
            subscribe: subscribeToGoals
        }
    };

    const addDependency = useCallback((module: ModuleName): void => {
        if (!user) throw new Error("Must be logged in to subscribe to Firebase");

        const entry = subStateRef.current[module];

        if (entry.count > 0) {
            entry.count++;
        } else if (entry.count === 0) {
            const { setState, subscribe } = subscriptionDefinitions[module];
            entry.count++;
            entry.unsubscribe = subscribe(user.uid, setState);
        } else {
            throw new Error (`Invalid subscription number: ${module} has subscription count ${entry.count}`);
        }
    }, [user])

    const removeDependency = useCallback((module: ModuleName): void => {
        if (!user) throw new Error("Must be logged in to perform this action");

        const entry = subStateRef.current[module];

        if (entry.count > 1) {
            entry.count--;
        } else if (entry.count === 1) {
            const { setState } = subscriptionDefinitions[module];
            if (entry.unsubscribe) {
                entry.unsubscribe();
                entry.count--;
                entry.unsubscribe = null;
                setState(null);
            } else {
                throw new Error("Unsubscribe is not defined");
            }
        } else {
            if (entry.count === 0) {
                throw new Error("Attempted to decrement subscription count, but it is already 0");
            } else {
                throw new Error(`Invalid subscription number: ${module} has subscription count ${entry.count}`);
            }
        }
    }, [user])

    useEffect(() => {
        return () => {
            const subState = subStateRef.current;

            Object.values(subState).forEach(value => {
                value.count = 0;
                if (value.unsubscribe) {
                    value.unsubscribe();
                }
                value.unsubscribe = null;
            });

            Object.values(subscriptionDefinitions).forEach(value => {
                value.setState(null);
            });
        };
    }, []);

    const contextValue = useMemo(
        () => ({goals, addDependency, removeDependency}),
        [goals, addDependency, removeDependency]
    )

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
};