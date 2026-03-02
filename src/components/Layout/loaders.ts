import { redirect } from "react-router-dom";
import { getCurrentUserInfo } from "../../services/auth";

export async function protectedLoader() {
    const user = await getCurrentUserInfo();
    if (!user) {
        // TODO: redirectTo search param for nav after login
        // TODO: UI message about needing to log in
        return redirect("/welcome");
    }
    return user;
};

export async function publicLoader() {
    const user = await getCurrentUserInfo();
    if (user) {
        return redirect("/");
    }
    return user;
};