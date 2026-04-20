import {
    Form,
    Link,
    useActionData,
    useNavigation,
    useSearchParams,
} from "react-router-dom";
import type { LoginActionData } from "./loginAction";
import styles from "../AuthForm.module.css";

export default function Login() {
    const actionData = useActionData() as LoginActionData | undefined;
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();

    const isSubmitting = navigation.state === "submitting";
    const redirectTo = searchParams.get("redirectTo");

    // Preserve redirectTo when linking to register
    const registerPath = redirectTo
        ? `/register?${new URLSearchParams({ redirectTo })}`
        : "/register";

    return (
        <div className={styles.container}>
            <h1>Log In</h1>

            {redirectTo && (
                <p className={styles.notice}>Please log in to continue.</p>
            )}

            {actionData?.error && (
                <p role="alert" className={styles.error}>
                    {actionData.error}
                </p>
            )}

            <Form method="post" className={styles.form}>
                <label className={styles.field}>
                    <span>Email</span>
                    <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </label>

                <label className={styles.field}>
                    <span>Password</span>
                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.btn}
                >
                    {isSubmitting ? "Logging in…" : "Log In"}
                </button>
            </Form>

            <p className={styles.switchAuth}>
                Don't have an account? <Link to={registerPath}>Register</Link>
            </p>

            <p className={styles.switchAuth}>- or -</p>

            <Form method="post">
                <input name="email" type="hidden" value="guest@user.com" />

                <input name="password" type="hidden" value="guestuser" />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.btn}
                >
                    {isSubmitting ? "Logging in…" : "Continue As Guest"}
                </button>
            </Form>
        </div>
    );
}
