import { EdamamError } from "../../../errors";
import { fetchNextResults, searchEdamam } from "../../../services/edamam";
import type { ActionFunctionArgs, QueryParam, RecipeSearchActionResponse } from "../../../types";

export default async function recipeSearchAction({ request }: ActionFunctionArgs): Promise<RecipeSearchActionResponse | null> {
    const params: QueryParam[] = [];
    const data = await request.formData();

    const nextURL = data.get("nextURL");

    if (typeof nextURL === "string") {
        try {
            const results = await fetchNextResults(nextURL);
            return { ok: true, results };
        } catch (err) {
            if (err instanceof EdamamError) {
                return {
                    ok: false,
                    error: {
                        code: err.code,
                        message: err.message,
                        isRateLimit: err.isRateLimit,
                        retryAfterSeconds: err.retryAfterSeconds,
                        attemptedNextURL: nextURL
                    }
                };
            }

            throw err;
        }
    }

    const q = data.get("q");

    if (typeof q !== "string" || q.trim().length === 0) {
        data.delete("q");
    } else {
        data.set("q", q.trim());
    }

    for (const [key, value] of data.entries()) {
        if (typeof value !== "string") {
            continue;
        }

        params.push({ key, value } as QueryParam);
    }

    if (params.length === 0) {
        return null;
    }

    try {
        const results = await searchEdamam(params);
        return { ok: true, results };
    } catch (err) {
        if (err instanceof EdamamError) {
            return {
                ok: false,
                error: {
                    code: err.code,
                    message: err.message,
                    isRateLimit: err.isRateLimit,
                    retryAfterSeconds: err.retryAfterSeconds
                }
            };
        }

        throw err;
    }
}
