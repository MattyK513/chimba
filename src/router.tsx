import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "./components/Layout/ProtectedLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import ErrorComponent from "./components/Error/Error";
import { Home, Goals, Travel, Profile, Login, loginAction, Register, registerAction, Landing } from "./pages";

import { protectedLoader, publicLoader } from "./components/Layout/loaders";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedLayout />,
        loader: protectedLoader,
        errorElement: <ErrorComponent />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "goals",
                element: <Goals />
            },
            {
                path: "travel",
                element: <Travel />
            },
            {
                path: "profile",
                element: <Profile />
            },
        ]
    },
    {
        element: <PublicLayout />,
        loader: publicLoader,
        errorElement: <ErrorComponent />,
        children: [
            {
                path: "/welcome",
                element: <Landing />
            },
            {
                path: "/login",
                element: <Login />,
                action: loginAction
            },
            {
                path: "/register",
                element: <Register />,
                action: registerAction
            }
        ]
    }
]);

export default router;