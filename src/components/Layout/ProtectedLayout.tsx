import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../Navbar/Navbar";

export default function ProtectedLayout() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <h1 className="loadingState">Loading...</h1>
        );
    } else if (!user) {
        return (
            <Navigate to="/welcome" replace state={{ from: location}} />
        );
    }
    
    return (
            <>
                <Navbar />
                <Outlet />
            </>
        );
};
