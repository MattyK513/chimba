import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <h1 className="loadingState">Loading...</h1>;
    } else if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
