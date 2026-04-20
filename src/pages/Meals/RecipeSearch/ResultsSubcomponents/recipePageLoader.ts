import { recipeIsKnown } from "../../../../cache/knownRecipes";
import { redirect } from "react-router-dom";
import { searchEdamamById } from "../../../../services/edamam";
import type { Params } from "../../../../types";

export default async function recipePageLoader({
    params,
}: {
    params: Params<string>;
}) {
    const id = params.recipeId ?? null;

    if (!id) return redirect("/meal-planner/recipe-search");

    if (recipeIsKnown(id)) return null;

    const recipeData = await searchEdamamById(id);

    return recipeData;
}
