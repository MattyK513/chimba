/*import { Form, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
    const { register, logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <>
            <h1>Register page</h1>
            <button onClick={() =>register("a@b.com", "skibidiohio")}>Create temp user</button>
            <button onClick={() => logIn("a@b.com", "skibidiohio")}>Log in temp user</button>
            {actionData?.error && <span role="alert">{actionData.error}</span>}
            <Form method="post">
                <label>
                    Enter your email
                    <input name="email" type="email" placeholder="user@example.com" required />
                </label>
                <label>
                    Enter your password
                    <input name="password" type="password" required />
                </label>
                <label>
                    Confirm your password
                    <input name="password-confirmation" type="password" required />
                </label>
                <label>
                    Choose a display name
                    <input name="display-name" />
                </label>
                {/* TODO: Photo upload capability 
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account" : "Create Account"}
                </button>
            </Form>
        </>
    )
};*/

import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import type { RegisterActionData } from "./registerAction";
import styles from "./Register.module.css";

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