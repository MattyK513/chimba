import { Link, Outlet, useFetcher, useLocation } from "react-router-dom";
import { searchEdamam } from "../../services/edamam";
import { allergyOptions } from "../../constants/edamam";
import RecipeSearch from "./RecipeSearch/RecipeSearch";
import type { EdamamResponse, QueryParam } from "../../types";

export default function Meals() {
    const fetcher = useFetcher<EdamamResponse>();
    const location = useLocation();

    const currentPath = location.pathname;

    return (
        <>
            <h1>Meal planner page</h1>
            {currentPath === "/meal-planner/recipe-search"
                ? "Link will go here"
                : <Link to="recipe-search">find recipes</Link>}
            <Outlet context={{ fetcher }} />
        </>
    );
};