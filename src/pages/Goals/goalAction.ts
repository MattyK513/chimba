import { addGoal } from "../../services/firestore";
import { getCurrentUserInfo } from "../../services/auth";
import { AuthError } from "../../errors";
import type { ActionFunctionArgs } from "../../types";

export default async function action({request}: ActionFunctionArgs) {
    const user = await getCurrentUserInfo();
    if (!user) throw new AuthError("unauthorized", "Cannot edit goal list while unauthenticated");
    const data = await request.formData();
    const title = data.get("title");

    if (typeof title !== "string" || title.trim() === "") {
        return null;
    }

    await addGoal(user.uid, title);
};