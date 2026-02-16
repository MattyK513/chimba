import { searchEdamam } from "../../../services/edamam";
import type { ActionFunctionArgs } from "../../../types/react";
import type { QueryParam } from "../../../types/edamam";

export default async function recipeSearchAction({ request }: ActionFunctionArgs) {
    const params: QueryParam[] = [];
    const data = await request.formData();

    //const searchQuery = data.get("keyword-search");
    //if (searchQuery) params.push({key: "q", value: String(searchQuery)});

    for (const [key, value] of data.entries()) {
        if (key === "keyword-search") {
            if (value) params.push({key: "q", value: value})
        } else {
            params.push({
            key: key as QueryParam["key"],
            value 
        });
        }
    };

    console.log(params)
    await searchEdamam(params);
};