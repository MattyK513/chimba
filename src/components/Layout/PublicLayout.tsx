import { Navigate, Outlet, useNavigation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Layout for unauthenticated routes (landing, login, register).
 * Redirects to the app home if a user is already signed in.
 */
export default function PublicLayout() {
    const { user, loading } = useAuth();
    const navigation = useNavigation();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (user && navigation.state === "idle") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
