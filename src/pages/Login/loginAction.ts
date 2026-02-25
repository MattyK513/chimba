import authFunctions from "../../services/auth";
import type { ActionFunctionArgs } from "../../types";

export default async function action({request}: ActionFunctionArgs) {
    const { logIn } = authFunctions;
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (typeof(email) !== "string" || typeof(password) !== "string") {
        throw new Error("Invalid form submission");
    }

    if (!email || !password) {
        return { error: "Email and password are required"};
    }

    if (!email.includes("@")) {
        return { error: "Invalid email address" };
    }

    try {
        await logIn(email, password);
        // Redirect behavior is handled by route protectors
        return null;
    } catch {
        return { error: "Incorrect email or password"};
    }
};