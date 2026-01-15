import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorComponent from "./components/Error/Error";
import { Home, Goals, Travel, Profile, Login } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
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
            {
                path:"login",
                element: <Login />
            }
        ]
    }
]);

export default router;