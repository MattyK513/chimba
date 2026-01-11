import { logInWithEmailAndPassword, logOut } from "../../services/auth";

export default function Profile() {
    return (
        <>
            <button onClick={() => logInWithEmailAndPassword("test@example.com", "iderkrn")}>Log in</button>
            <button onClick={logOut}>Log out</button>
        </>
    )
};