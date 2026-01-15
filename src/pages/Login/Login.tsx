import useAuth from "../../hooks/useAuth";
import { auth } from "../../config/firebase";

export default function Login() {
    const { logIn, logOut } = useAuth();

    return (
        <div>
            <button onClick={() => {logIn("test@example.com", "iderkrn")}}>Sign in</button>
            <button onClick={logOut}>Sign out</button>
            <button onClick={() => {console.log(auth.currentUser)}}>Log data</button>
        </div>
    )
};