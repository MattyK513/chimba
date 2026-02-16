import { appId, appKey } from "../config/edamam";
import type { QueryParam } from "../types/edamam";

export async function searchEdamam(params: QueryParam[]) {
    const url = buildSearchURL(params);

    try { 
        const response = await fetch(url);
        const data = await response.json();

        console.log(data)
    } catch (err) {
        throw err;
    }
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