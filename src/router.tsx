import { createBrowserRouter } from "react-router-dom";
import { ErrorComponent, ProtectedLayout, protectedLoader, PublicLayout, publicLoader } from "./components";
import { Home, Goals, goalAction, Landing, Meals, Travel, Profile, profileAction, Login, loginAction, RecipeSearch, recipeSearchAction, Register, registerAction } from "./pages";

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
                element: <Goals />,
                action: goalAction
            },
            {
                path: "travel",
                element: <Travel />
            },
            {
                path: "meal-planner",
                element: <Meals />,
                children: [
                    {
                        path: "recipe-search",
                        element: <RecipeSearch />,
                        action: recipeSearchAction
                    }
                ]
            },
            {
                path: "profile",
                element: <Profile />,
                action: profileAction
            },
        ]
    },
    {
        path: "/",
        element: <PublicLayout />,
        loader: publicLoader,
        errorElement: <ErrorComponent />,
        children: [
            {
                path: "welcome",
                element: <Landing />
            },
            {
                path: "login",
                element: <Login />,
                action: loginAction
            },
            {
                path: "register",
                element: <Register />,
                action: registerAction
            }
        ]
    }
]);

export default router;