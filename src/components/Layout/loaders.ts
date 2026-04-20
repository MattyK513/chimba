import { redirect } from "react-router-dom";
import { getCurrentUserInfo } from "../../services/auth";
import type { LoaderFunctionArgs } from "../../types";

/**
 * Gates initial access to protected routes. Unauthenticated users are
 * sent to login with their intended destination preserved.
 */
export async function protectedLoader({ request }: LoaderFunctionArgs) {
    const user = await getCurrentUserInfo();

    if (!user) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return redirect("/welcome");
        }
        
        const params = new URLSearchParams({
            redirectTo: url.pathname + url.search,
        });
        return redirect(`/login?${params}`);
    }

    return user;
}

/**
 * Guards public-only routes. Bounces already-authenticated users to home.
 */
export async function publicLoader() {
    const user = await getCurrentUserInfo();

    if (user) {
        return redirect("/");
    }

    return null;
}