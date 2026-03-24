import { getCurrentUserInfo, updateUsernameOrPhotoURL } from "../../services/auth";
import { updateUserInfo } from "../../services/firestore/profile";
import { AuthError, ValidationError } from "../../errors";
import type { ActionFunctionArgs } from "../../types/react";

export default async function profileAction({request}: ActionFunctionArgs) {
    const user = await getCurrentUserInfo();
    if (!user) throw new AuthError("unauthenticated", "Must be logged in to update profile information.");
    const formData = await request.formData();
    const rawDisplayName = formData.get("displayName");

    if (rawDisplayName !== null && typeof rawDisplayName !== "string") {
        throw new ValidationError("invalid-display-name", "Invalid form submission");
    }

    const displayName: string | null = rawDisplayName?.trim() === "" ? null : rawDisplayName?.trim() ?? null;

    await updateUsernameOrPhotoURL({ displayName });
    await updateUserInfo(user.uid, { displayName });
};