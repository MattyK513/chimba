import authFunctions from "../../services/auth";
import type { ActionFunctionArgs } from "../../types/react";
import { createFirestoreUser } from "../../services/firestore";

export default async function action({request}: ActionFunctionArgs) {
    const { register, updateUsernameOrPhotoURL } = authFunctions;
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const passwordConfirmation = data.get("password-confirmation");
    const displayName = data.get("display-name");

    if (typeof(email) !== "string" || typeof(password) !== "string" || typeof(passwordConfirmation) !== "string" || typeof(displayName) !== "string") {
        throw new Error("Invalid form submission");
    }

    if (password.length < 6) {
        return { error: "Password must contain at least 6 characters"}
    }

    if (password !== passwordConfirmation) {
        return { error: "Passwords do not match"};
    }

    const user = await register(email, password);
    if (displayName) {
        console.log(displayName)
        await updateUsernameOrPhotoURL(user, {displayName: displayName});
    }
    console.log(user)
    await createFirestoreUser(user);
};