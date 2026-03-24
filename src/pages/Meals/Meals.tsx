import { useState } from "react";
import { Link, Outlet, useFetcher, useLocation } from "react-router-dom";
import type { EdamamHit, RecipeSearchActionResponse } from "../../types";
import WeeklyPlanner from "./Planner/WeeklyPlanner";
import GroceryList from "./Planner/GroceryList";
import styles from "./Meals.module.css";

type PlannerView = "meal-plan" | "grocery-list";

export default function Meals() {
    const fetcher = useFetcher<RecipeSearchActionResponse>();
    const location = useLocation();
    const currentPath = location.pathname;

    const [allSearchHits, setAllSearchHits] = useState<EdamamHit[]>([]);
    const [plannerView, setPlannerView] = useState<PlannerView>("meal-plan");

    const isPlannerRoot = currentPath === "/meal-planner";
    const isRecipeSearch = currentPath === "/meal-planner/recipe-search";

    return (
        <div className={styles.mealPage}>
            {isPlannerRoot && <h1>Meal planner page</h1>}
            {isPlannerRoot
                ? <Link to="recipe-search">find recipes</Link>
                : isRecipeSearch
                    ? <Link to="." className={styles.backToPlannerLink}>← back to meal planner</Link>
                    : <Link to="/meal-planner/recipe-search" className={styles.backToPlannerLink}>← back to recipe search</Link>
            }
            {isPlannerRoot && (
                <>
                    <div className={styles.toggleRow}>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${plannerView === "meal-plan" ? styles.activeToggle : ""}`}
                            onClick={() => setPlannerView("meal-plan")}
                        >
                            Meal plan
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${plannerView === "grocery-list" ? styles.activeToggle : ""}`}
                            onClick={() => setPlannerView("grocery-list")}
                        >
                            Grocery list
                        </button>
                    </div>
                    {plannerView === "meal-plan" ? <WeeklyPlanner /> : <GroceryList />}
                </>
            )}
            <Outlet context={{ fetcher, allHits: allSearchHits, setAllHits: setAllSearchHits }} />
        </div>
    );
}
