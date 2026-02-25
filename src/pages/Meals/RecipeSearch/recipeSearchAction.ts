import { searchEdamam } from "../../../services/edamam";
import type { ActionFunctionArgs, QueryParam } from "../../../types";

export default async function recipeSearchAction({ request }: ActionFunctionArgs) {
    const params: QueryParam[] = [];
    const data = await request.formData();
    let q = data.get("q");

    if (typeof q !== "string" || q.trim().length === 0) {
        data.delete("q");
    } else {
        data.set("q", q.trim());
    };

    for (const [key, value] of data.entries()) {
        if (typeof value !== "string") continue; 
            params.push({ key, value } as QueryParam);
    };

    return await searchEdamam(params);
};