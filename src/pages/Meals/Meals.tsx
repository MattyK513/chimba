import { Outlet } from "react-router-dom";
import { searchEdamam } from "../../services/edamam";
import { allergyOptions } from "../../constants/edamam";
import RecipeSearch from "./RecipeSearch/RecipeSearch";
import type { QueryParam } from "../../types/edamam";

export default function Meals() {

    const testSearch: QueryParam[] = [{key: "q", value: "chicken"}];
    searchEdamam(testSearch);

    return (
        <>
            <h1>Meal planner page</h1>
            <Outlet />
        </>
    )
};