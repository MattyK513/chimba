import { useEffect } from "react";
import useUserData from "./useUserData";
import { addGoal } from "../services/firestore";

export default function useGoals() {
    const { addDependency, removeDependency, goals } = useUserData();

    useEffect(() => {
        addDependency("goals");
        return () => removeDependency("goals");
    }, []);

    return { goals, addGoal };
}
