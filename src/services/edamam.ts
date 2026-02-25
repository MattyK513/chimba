import { appId, appKey } from "../config/edamam";
import type { EdamamResponse, QueryParam, NutrientOption } from "../types";

export async function searchEdamam(params: QueryParam[]): Promise<EdamamResponse> {
    const url = buildSearchURL(params);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
    }

    return response.json();
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

export function sortNutrients(nutrients: NutrientOption[]) {
    const groups: Record<string, NutrientOption[]> = {};
    for (const n of nutrients) {
        (groups[n.group] ??= []).push(n);
    };
    return groups;
};