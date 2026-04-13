import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import type { RegisterActionData } from "./registerAction";
import styles from "../AuthForm.module.css";

export default function Register() {
    const actionData = useActionData() as RegisterActionData | undefined;
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();

    const isSubmitting = navigation.state === "submitting";
    const redirectTo = searchParams.get("redirectTo");

    // Preserve redirectTo when linking to login
    const loginPath = redirectTo
        ? `/login?${new URLSearchParams({ redirectTo })}`
        : "/login";

    return (
        <div className={styles.container}>
            <h1>Create Account</h1>

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
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </label>

                <label className={styles.field}>
                    <span>Confirm Password</span>
                    <input
                        name="password-confirmation"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </label>

                <label className={styles.field}>
                    <span>Display Name (optional)</span>
                    <input
                        name="display-name"
                        type="text"
                        placeholder="How should we call you?"
                        autoComplete="name"
                    />
                </label>

                {/* TODO: Photo upload capability */}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account…" : "Create Account"}
                </button>
            </Form>

            <p className={styles.switchAuth}>
                Already have an account? <Link to={loginPath}>Log in</Link>
            </p>
        </div>
    );
}