import { appId, appKey } from "../config/edamam";
import { clearKnownRecipes, markRecipeKnown } from "../cache/knownRecipes";
import type { Dispatch, EdamamHit, EdamamResponse , IngredientResult, NutrientOption, QueryParam, SetStateAction } from "../types";

export async function searchEdamam(params: QueryParam[]): Promise<EdamamResponse> {
    const url = buildSearchURL(params);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
    }

    const results = await response.json();
    defineAndCacheRecipeIds(results);

    return results;
};

function buildSearchURL(params: QueryParam[]): URL {
    let url = new URL("https://api.edamam.com/api/recipes/v2");

    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("type", "any");

    params.forEach(({key, value} ) => {
        url.searchParams.append(key, String(value));
    });

    return url;
};

export async function fetchNextResults(url: string): Promise<EdamamResponse> {
    const response = await fetch(url);

    if (!response.ok) {
        // IMPORTANT UI FEATURE: implement 
        throw new Error(`Edamam pagination error: ${response.status}`);
    }

    const results = await response.json();
    defineAndCacheRecipeIds(results);


    return results;
};

export async function searchEdamamById(id: string): Promise<EdamamHit> {
    const response = await fetch(`https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${appId}&app_key=${appKey}`);
    return await response.json();
};

/*
https://api.edamam.com/api/recipes/v2/
    fac0fed123103b648c8d6c46353cf8a5
    ?type=public
    &app_id=2e9caf28
    &app_key=cc70ae5e0d9c88f38b960359458c6e17
*/

function defineAndCacheRecipeIds(data: EdamamResponse) {
    data.hits.forEach(hit => {
        const newId = hit.recipe.uri.split("#recipe_")[1];
        hit.recipe.id = newId;
        markRecipeKnown(newId);
    });

};

export function sortNutrients(nutrients: NutrientOption[]) {
    const groups: Record<string, NutrientOption[]> = {};
    for (const n of nutrients) {
        (groups[n.group] ??= []).push(n);
    };
    return groups;
};

export function resetRecipeSearchState(stateSetter: Dispatch<SetStateAction<EdamamHit[]>>) {
    stateSetter([]);
    clearKnownRecipes();
};

export function addIngredientToGroceryList(ing: IngredientResult) {
    console.log(ing);
};