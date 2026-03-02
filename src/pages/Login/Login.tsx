import { Form, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Login.module.css";

export default function Login() {
    const { logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <main className="authShell">
            <section className="authCard section page">
                <h1>Log in</h1>
                <div className={styles.actions}>
                    <button type="button" onClick={() => logIn("test@example.com", "iderkrn")}>Use test user</button>
                </div>
                { actionData?.error && <span className="errorText" role="alert">{actionData.error}</span>}
                <Form method="post" className="formStack">
                    <label className="formLabel">
                        Email
                        <input name="email" type="email" placeholder="user@example.com" required />
                    </label>
                    <label className="formLabel">
                        Password
                        <input name="password" type="password" required />
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </Form>
            </section>
        </main>
    )
};
