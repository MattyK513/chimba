import { createBrowserRouter } from "react-router-dom";

const Home = () => <h1>Home Page</h1>;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    }
]);

export default router;