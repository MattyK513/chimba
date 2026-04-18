import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ThemeProvider from "../../contexts/themeContext";
import Navbar from "../Navbar/Navbar";
import styles from "./Layout.module.css";

/**
 * Layout for authenticated routes. The loader handles initial auth checks;
 * the useAuth hook here handles live sign-outs while already on a protected page.
 */
export default function ProtectedLayout() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <h1>Loading...</h1>
        );
    } else if (!user) {
        return (
            <Navigate to="/welcome" replace state={{ from: location}} />
        );
    }

    return (
        <ThemeProvider>
            <Navbar />
            <div className={styles.protectedContent}>
                <Outlet />
            </div>
        </ThemeProvider>
    );
}