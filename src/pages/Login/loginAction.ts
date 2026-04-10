import { redirect } from "react-router-dom";
import authFunctions from "../../services/auth";
import { safeRedirect } from "../../utils/safeRedirect";
import type { ActionFunctionArgs } from "../../types";

export interface LoginActionData {
    error: string;
}

export default async function loginAction({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Invalid form submission");
    }

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        await authFunctions.logIn(email, password);
    } catch {
        return { error: "Incorrect email or password" };
    }

    const redirectTo = new URL(request.url).searchParams.get("redirectTo");
    return redirect(safeRedirect(redirectTo));
}