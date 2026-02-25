import { addGoal } from "../../services/firestore";
import type { ActionFunctionArgs } from "../../types";

export default async function action({request}: ActionFunctionArgs) {
    const data = await request.formData();
    const title = data.get("title");

    if (typeof title !== "string" || title.trim() === "") {
        return null;
    }

    await addGoal(title);
};