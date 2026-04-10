import { useState } from "react";
import { Link, Outlet, useFetcher, useLocation } from "react-router-dom";
import useRateLimitCooldown from "../../hooks/useRateLimitCooldown";
import { isError } from "../../services/edamam";
import WeeklyPlanner from "./Planner/WeeklyPlanner";
import type { EdamamHit, EdamamResponse, InfiniteScrollErrorResponse } from "../../types";
import styles from "./Meals.module.css";

export default function Meals() {
    const fetcher = useFetcher<EdamamResponse | InfiniteScrollErrorResponse>();
    const location = useLocation();
    const currentPath = location.pathname;

    const [allSearchHits, setAllSearchHits] = useState<EdamamHit[]>([]);

    const searchIsDisabled = useRateLimitCooldown(isError(fetcher.data));

    return (
        <div className={styles.mealPage}>
            {currentPath === "/meal-planner"
                ? null
                : currentPath === "/meal-planner/recipe-search"
                ? <Link to="." className={styles.backToPlannerLink}>← back to meal planner</Link>
                : <Link to="/meal-planner/recipe-search" className={styles.backToPlannerLink}>← back to recipe search</Link>
            }
            {currentPath === "/meal-planner" && <WeeklyPlanner />}
            <Outlet context={{ fetcher, allHits: allSearchHits, setAllHits: setAllSearchHits, searchIsDisabled }} />
        </div>
    );
};