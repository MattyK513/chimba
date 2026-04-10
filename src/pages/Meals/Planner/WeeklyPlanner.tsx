import { Link } from "react-router-dom";
import placeholderStyles from "../../PlaceholderPage.module.css";
import styles from "./WeeklyPlanner.module.css";

const plannedFeatures = [
    {
        title: "Weekly Calendar",
        description: "Assign recipes to breakfast, lunch, and dinner slots across a drag-and-drop weekly view.",
    },
    {
        title: "Grocery List Tracker",
        description: "Automatically compile recipe ingredients from search or meal plan, or manually build your shopping list.",
    },
    {
        title: "Saved Recipes",
        description: "Favorite recipes from search and organize them into custom collections for quick access.",
    },
    {
        title: "Meal Prep Suggestions",
        description: "Get smart suggestions for batch-cooking and prep-ahead meals based on your week.",
    },
];

export default function WeeklyPlanner() {
    return (
        <div className={placeholderStyles.page}>

            <div className={placeholderStyles.titleRow}>
                <h1 className={placeholderStyles.title}>Meal Planner</h1>
                <span className={placeholderStyles.tag}>Coming Soon</span>
            </div>

            <p className={placeholderStyles.subtitle}>
                The full meal planning experience is in the works. In the meantime, you can start
                exploring recipes with the search tool.
            </p>

            <Link to="recipe-search" className={styles.primaryLink}>
                Try Recipe Search →
            </Link>

            <section className={placeholderStyles.featureList}>
                {plannedFeatures.map((feature) => (
                    <div key={feature.title} className={placeholderStyles.featureCard}>
                        <h3 className={placeholderStyles.featureTitle}>{feature.title}</h3>
                        <p className={placeholderStyles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}