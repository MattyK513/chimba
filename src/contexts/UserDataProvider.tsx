import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { subscribeToGoals, subscribeToMealPlans, subscribeToGroceryList, subscribeToSavedRecipes } from "../services/firestore";
import type { Goal, Ingredient, MealModuleData, MealPlans, ModuleName, ReactNode, SavedRecipeWithId, SubState, UserDataContextType } from "../types";

export const UserDataContext = createContext<UserDataContextType | null>(null);

const initialSubState: SubState = {
    goals: {
        count: 0,
        unsubscribe: null
    },
    mealPlans: {
        count: 0,
        unsubscribe: null
    },
    groceryList: {
        count: 0,
        unsubscribe: null
    },
    savedRecipes: {
        count: 0,
        unsubscribe: null
    }
};

export default function UserDataContextProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [goalData, setGoalData] = useState<Goal[] | null>(null);
    const [groceryListData, setGroceryListData] = useState<Ingredient[] | null>(null);
    const [mealPlanData, setMealPlanData] = useState<MealPlans | null>(null);
    const [savedRecipeData, setSavedRecipeData] = useState<SavedRecipeWithId[] | null>(null);

    const subStateRef = useRef<SubState>(structuredClone(initialSubState));

    const subscriptionDefinitions = {
        goals: {
            setState: setGoalData,
            subscribe: subscribeToGoals
        },
        mealPlans: {
            setState: setMealPlanData,
            subscribe: subscribeToMealPlans
        },
        groceryList: {
            setState: setGroceryListData,
            subscribe: subscribeToGroceryList
        },
        savedRecipes: {
            setState: setSavedRecipeData,
            subscribe: subscribeToSavedRecipes
        }
    };

    const addDependency = useCallback((module: ModuleName): void => {
        if (!user) throw new Error("Must be logged in to subscribe to Firebase");

        const entry = subStateRef.current[module];

        if (entry.count > 0) {
            entry.count++;
            return;
        }
        
        if (entry.count < 0) {
            throw new Error (`Invalid subscription number: ${module} has subscription count ${entry.count}`);
        }

        entry.count++;
        switch(module) {
            case "goals":
            entry.unsubscribe = subscribeToGoals(user.uid, setGoalData);
            break;
        case "mealPlans":
            entry.unsubscribe = subscribeToMealPlans(user.uid, setMealPlanData);
            break;
        case "groceryList":
            entry.unsubscribe = subscribeToGroceryList(user.uid, setGroceryListData);
            break;
        case "savedRecipes":
            entry.unsubscribe = subscribeToSavedRecipes(user.uid, setSavedRecipeData);
            break; 
        }

    }, [user]);

    const removeDependency = useCallback((module: ModuleName): void => {
        if (!user) throw new Error("Must be logged in to perform this action");

        const entry = subStateRef.current[module];

        if (entry.count > 1) {
            entry.count--;
            return;
        }

        if (entry.count === 1) {
            entry.count--;
            
            if (!entry.unsubscribe) {
                throw new Error(`Unsubscribe is not defined for module: ${module}`);
            }

            entry.unsubscribe();
            entry.unsubscribe = null;

            switch (module) {
                case "goals":
                    setGoalData(null);
                    break;
                case "mealPlans":
                    setMealPlanData(null);
                    break;
                case "groceryList":
                    setGroceryListData(null);
                    break;
                case "savedRecipes":
                    setSavedRecipeData(null);
                    break;
            }

            return;
        }

        throw new Error(
            `Attempted to remove dependency for "${module}" but count is ${entry.count}`
        );
    }, [user]);

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
        () => ({
            goals: goalData,
            mealPlans: mealPlanData,
            groceryList: groceryListData,
            savedRecipes: savedRecipeData, addDependency, removeDependency}),
        [goalData, mealPlanData, groceryListData, savedRecipeData, addDependency, removeDependency]
    )

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
};