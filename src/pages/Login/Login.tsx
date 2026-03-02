import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Login.module.css";

export default function Login() {
    const { logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <section className={`pageShell ${styles.authPanel}`}>
            <h1>Welcome back</h1>
            <p>Sign in to continue planning with Chimba.</p>
            <button className={styles.quickLogin} onClick={() => logIn("test@example.com", "iderkrn")}>Log in test user</button>
            {actionData?.error && <span className={styles.error} role="alert">{actionData.error}</span>}
            <Form method="post" className={styles.form}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="user@example.com" required />
                </label>
                <label>
                    Password
                    <input name="password" type="password" required />
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </Form>
            <p className={styles.footer}>No account yet? <Link to="/register">Create one</Link>.</p>
        </section>
    );
}
