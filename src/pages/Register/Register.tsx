import { Form, useActionData, useNavigation } from "react-router-dom";
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
                    <input name="password" required />
                </label>
                <label>
                    Confirm your password
                    <input name="password-confirmation" required />
                </label>
                <label>
                    Choose a display name
                    <input name="display-name" />
                </label>
                {/* TODO: Photo upload capability */}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account" : "Create Account"}
                </button>
            </Form>
        </>
    )
};