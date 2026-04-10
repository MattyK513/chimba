/*import { Form, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
    const { logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={() => logIn("test@example.com", "iderkrn")}>Log in test user</button>
            { actionData?.error && <span role="alert">{actionData.error}</span>}
            <Form method="post">
                <label>
                    Enter your email
                    <input name="email" type="email" placeholder="user@example.com" required />
                </label>
                <label>
                    Enter your password
                    <input name="password" type="password" required ></input>
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </Form>
        </div>
    )
};*/

import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import type { LoginActionData } from "./loginAction";
import styles from "./Login.module.css";

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

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in…" : "Log In"}
                </button>
            </Form>

            <p className={styles.switchAuth}>
                Don't have an account? <Link to={registerPath}>Register</Link>
            </p>
        </div>
    );
}