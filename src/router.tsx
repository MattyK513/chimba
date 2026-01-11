import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import { Home, Goals, Travel, Profile } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
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
            }
        ]
    }
]);

export default router;