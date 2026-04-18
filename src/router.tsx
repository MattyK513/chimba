import { createBrowserRouter } from "react-router-dom";
import {
    ErrorComponent,
    ProtectedLayout,
    protectedLoader,
    PublicLayout,
    publicLoader,
    Spinner
} from "./components";
import {
    Goals,
    goalAction,
    Home,
    Landing,
    Login,
    loginAction,
    Meals,
    Profile,
    profileAction,
    RecipePage,
    recipePageLoader,
    RecipeSearch,
    recipeSearchAction,
    Register,
    registerAction,
    Travel
} from "./pages";

// The app is split into two top-level route trees that share the same root path.
// Loader guards decide whether a user sees the authenticated app shell or the public entry flow.
const router = createBrowserRouter([
    // Authenticated application routes.
    {
        path: "/",
        element: <ProtectedLayout />,
        loader: protectedLoader,
        errorElement: <ErrorComponent />,
        hydrateFallbackElement: <Spinner variant="fullscreen" />,
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
                        action: recipeSearchAction,
                    },
                    {
                        path: "recipe-search/:recipeId",
                        element: <RecipePage />,
                        loader: recipePageLoader
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
    // Public routes shown when no authenticated user is present.
    {
        path: "/",
        element: <PublicLayout />,
        loader: publicLoader,
        errorElement: <ErrorComponent />,
        hydrateFallbackElement: <Spinner variant="fullscreen" message="Loading" />,
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
