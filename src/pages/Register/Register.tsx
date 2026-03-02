import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Register.module.css";

export default function Register() {
    const { register, logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <section className={`pageShell ${styles.authPanel}`}>
            <h1>Create your account</h1>
            <p>Set up your Chimba profile and start organizing your life.</p>
            <div className={styles.helperActions}>
                <button onClick={() => register("a@b.com", "skibidiohio")}>Create temp user</button>
                <button onClick={() => logIn("a@b.com", "skibidiohio")}>Log in temp user</button>
            </div>
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
                <label>
                    Confirm password
                    <input name="password-confirmation" type="password" required />
                </label>
                <label>
                    Display name
                    <input name="display-name" />
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account" : "Create Account"}
                </button>
            </Form>
            <p className={styles.footer}>Already have an account? <Link to="/login">Sign in</Link>.</p>
        </section>
    );
}
