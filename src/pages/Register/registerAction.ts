/*import authFunctions from "../../services/auth";
import type { ActionFunctionArgs } from "../../types/react";
import { createFirestoreUser } from "../../services/firestore/profile";

export default async function action({request}: ActionFunctionArgs) {
    const { register } = authFunctions;
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const passwordConfirmation = data.get("password-confirmation");
    const displayName = data.get("display-name");

    if (typeof(email) !== "string" || typeof(password) !== "string" || typeof(passwordConfirmation) !== "string" || typeof(displayName) !== "string") {
        throw new Error("Invalid form submission");
    }

    if (password.length < 6) {
        return { error: "Password must contain at least 6 characters"};
    }

    if (password !== passwordConfirmation) {
        return { error: "Passwords do not match"};
    }

    const user = await register(email, password, {displayName});

    await createFirestoreUser(user);
};*/

import { redirect } from "react-router-dom";
import authFunctions from "../../services/auth";
import { createFirestoreUser } from "../../services/firestore/profile";
import { safeRedirect } from "../../utils/safeRedirect";
import type { ActionFunctionArgs } from "../../types";

export interface RegisterActionData {
    error: string;
}

export default async function registerAction({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const passwordConfirmation = data.get("password-confirmation");
    const displayName = data.get("display-name");

    // Validate types
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof passwordConfirmation !== "string"
    ) {
        throw new Error("Invalid form submission");
    }

    // Validate values
    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    if (password !== passwordConfirmation) {
        return { error: "Passwords do not match" };
    }

    const normalizedDisplayName =
        typeof displayName === "string" && displayName.trim()
            ? displayName.trim()
            : null;

    try {
        const user = await authFunctions.register(email, password, {
            displayName: normalizedDisplayName,
        });
        await createFirestoreUser(user);
    } catch (err) {
        // Firebase auth errors have a `code` property
        const code = (err as { code?: string }).code;
        if (code === "auth/email-already-in-use") {
            return { error: "An account with this email already exists" };
        }
        if (code === "auth/invalid-email") {
            return { error: "Invalid email address" };
        }
        return { error: "Registration failed. Please try again." };
    }

    const redirectTo = new URL(request.url).searchParams.get("redirectTo");
    return redirect(safeRedirect(redirectTo));
}