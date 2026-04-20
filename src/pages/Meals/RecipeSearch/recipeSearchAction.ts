import { fetchNextResults, searchEdamam } from "../../../services/edamam";
import type { ActionFunctionArgs, QueryParam } from "../../../types";

export default async function recipeSearchAction({
    request,
}: ActionFunctionArgs) {
    const params: QueryParam[] = [];
    const data = await request.formData();

    const nextURL = data.get("nextURL");

    if (typeof nextURL === "string") {
        try {
            return await fetchNextResults(nextURL);
        } catch (err) {
            if (
                err instanceof Error &&
                err.message === "Edamam pagination error: 429"
            )
                return { error: true, nextURL: nextURL };
            throw err;
        }
    }

    let q = data.get("q");

    if (typeof q !== "string" || q.trim().length === 0) {
        data.delete("q");
    } else {
        data.set("q", q.trim());
    }

    for (const [key, value] of data.entries()) {
        if (typeof value !== "string") continue;
        params.push({ key, value } as QueryParam);
    }

    if (params.length === 0) {
        return null;
    }
    return await searchEdamam(params);
}
