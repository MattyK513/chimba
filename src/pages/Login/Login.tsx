import { Form, useActionData, useNavigation } from "react-router-dom";
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
};