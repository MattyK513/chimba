import { Link, Outlet, useLocation } from "react-router-dom";

export default function Meals() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <main className="page">
            <section className="section page">
                <h1>Meal planner</h1>
                <p className="subtle">Search and save meal ideas without leaving the app flow.</p>
                {currentPath === "/meal-planner/recipe-search"
                    ? <p className="subtle">Recipe filters are open below.</p>
                    : <Link to="recipe-search">Open recipe search</Link>}
            </section>
            <Outlet />
        </main>
    );
};
