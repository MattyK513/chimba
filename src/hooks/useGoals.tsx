import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { subscribeToGoals } from "../services/firestore";
import type { GoalList } from "../types/firebase";

export default function useGoals() {
    const [goals, setGoals] = useState<GoalList | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToGoals(user, (goalsFromDb) => {
            setGoals(goalsFromDb);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);

    return { goals, loading };
};