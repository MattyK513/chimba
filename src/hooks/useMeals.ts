import { useEffect } from "react";
import useUserData from "./useUserData";
import { setMeal } from "../services/firestore";

export default function useMeals() {
    const { addDependency, removeDependency, mealPlans, groceryList, savedRecipes } = useUserData();

    const modules = ["mealPlans", "groceryList", "savedRecipes"] as const;

    useEffect(() => {
        modules.forEach(addDependency);

        return () => {
            modules.forEach(removeDependency);
        };
    }, [addDependency, removeDependency]);

    return { mealPlans, groceryList, savedRecipes, setMeal };
};