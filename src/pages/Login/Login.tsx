import { Form, useActionData, useNavigation } from "react-router-dom";
import authFunctions from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import type { ActionFunctionArgs } from "../../types/firebase";

export async function action({request}: ActionFunctionArgs) {
    const { logIn } = authFunctions;
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (typeof(email) !== "string" || typeof(password) !== "string") {
        throw new Error("Invalid form submission");
    }

    if (!email || !password) {
        return { error: "Email and password are required"};
    }

    if (!email.includes("@")) {
        return { error: "Invalid email address" };
    }

    try {
        await logIn(email, password);
        // Redirect behavior is handled by route protectors
        return null;
    } catch {
        return { error: "Incorrect email or password"};
    }
};

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
                    <input name="password" required ></input>
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </Form>
        </div>
    )
};