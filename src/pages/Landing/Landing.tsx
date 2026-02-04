import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <>
            <h1>Welcome to Chimba!</h1>
            <Link to="/login">Sign in</Link>
            <p>or</p>
            <Link to="/register">Create an account</Link>
        </>
    )
};