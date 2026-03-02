import { Form, useActionData, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Register.module.css";

export default function Register() {
    const { register, logIn } = useAuth();
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <main className="authShell">
            <section className="authCard section page">
                <h1>Create account</h1>
                <div className={styles.actions}>
                    <button type="button" onClick={() => register("a@b.com", "skibidiohio")}>Create temp user</button>
                    <button type="button" onClick={() => logIn("a@b.com", "skibidiohio")}>Log in temp user</button>
                </div>
                {actionData?.error && <span className="errorText" role="alert">{actionData.error}</span>}
                <Form method="post" className="formStack">
                    <label className="formLabel">
                        Email
                        <input name="email" type="email" placeholder="user@example.com" required />
                    </label>
                    <label className="formLabel">
                        Password
                        <input name="password" type="password" required />
                    </label>
                    <label className="formLabel">
                        Confirm password
                        <input name="password-confirmation" type="password" required />
                    </label>
                    <label className="formLabel">
                        Display name
                        <input name="display-name" />
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </Form>
            </section>
        </main>
    )
};
