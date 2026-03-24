import { useState } from "react";
import { Link, Outlet, useFetcher, useLocation } from "react-router-dom";
import useMeals from "../../hooks/useMeals";
import { searchEdamam } from "../../services/edamam";
import { allergyOptions } from "../../constants/edamam";
import RecipeSearch from "./RecipeSearch/RecipeSearch";
import WeeklyPlanner from "./Planner/WeeklyPlanner";
import type { EdamamHit, EdamamResponse, QueryParam } from "../../types";
import styles from "./Meals.module.css";

export default function Meals() {
    const fetcher = useFetcher<EdamamResponse>();
    const location = useLocation();
    const currentPath = location.pathname;
    const { mealPlans, groceryList, savedRecipes } = useMeals();

    const [allSearchHits, setAllSearchHits] = useState<EdamamHit[]>([]);

    return (
        <div className={styles.mealPage}>
            {currentPath === "/meal-planner" && <h1>Meal planner page</h1>}
            {currentPath === "/meal-planner"
                ? <Link to="recipe-search">find recipes</Link>
                : currentPath === "/meal-planner/recipe-search"
                ? <Link to="." className={styles.backToPlannerLink}>← back to meal planner</Link>
                : <Link to="/meal-planner/recipe-search" className={styles.backToPlannerLink}>← back to recipe search</Link>
            }
            {currentPath === "/meal-planner" && <WeeklyPlanner />}
            <Outlet context={{ fetcher, allHits: allSearchHits, setAllHits: setAllSearchHits }} />
        </div>
    );
};