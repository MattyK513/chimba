import { appId, appKey } from "../config/edamam";
import { clearKnownRecipes, markRecipeKnown } from "../cache/knownRecipes";
import type { Dispatch, EdamamHit, EdamamResponse, InfiniteScrollErrorResponse, IngredientResult, NutrientOption, QueryParam, SetStateAction } from "../types";

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

export async function fetchNextResults(url: string): Promise<EdamamResponse> {
    const response = await fetch(url);

    if (!response.ok) {
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

export function addIngredientToGroceryList(ing: IngredientResult) {
    console.log(ing);
};

// Cache management

function defineAndCacheRecipeIds(data: EdamamResponse) {
    data.hits.forEach(hit => {
        const newId = hit.recipe.uri.split("#recipe_")[1];
        hit.recipe.id = newId;
        markRecipeKnown(newId);
    });
};

export function resetRecipeSearchState(stateSetter: Dispatch<SetStateAction<EdamamHit[]>>) {
    stateSetter([]);
    clearKnownRecipes();
};

// Helpers

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

export function sortNutrients(nutrients: NutrientOption[]) {
    const groups: Record<string, NutrientOption[]> = {};
    for (const n of nutrients) {
        (groups[n.group] ??= []).push(n);
    };
    return groups;
};

export function isError(response: EdamamResponse | InfiniteScrollErrorResponse | undefined) {
    return !!response && "error" in response;
};