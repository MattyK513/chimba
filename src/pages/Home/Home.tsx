import { Link } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
import styles from "./Home.module.css";

type Feature = {
    title: string;
    description: string;
    path: string;
    status: "available" | "coming-soon";
};

const features: Feature[] = [
    {
        title: "Recipe Search",
        description: "Search thousands of recipes and filter by diet, nutrition, cooking time, allergies, cuisine, and more. Browse rich results with  ingredient lists and full nutrition breakdowns.",
        path: "/meal-planner/recipe-search",
        status: "available",
    },
    {
        title: "Meal Planner",
        description: "Add recipes from search results or create your own, generate grocery lists from your planned meals, and save your favorite recipes for quick access later.",
        path: "/meal-planner",
        status: "coming-soon",
    },
    {
        title: "Goals",
        description: "Set personal goals, break them into subtasks, and track your progress over time with deadlines, categories, and streaks.",
        path: "/goals",
        status: "coming-soon",
    },
    {
        title: "Travel",
        description: "Plan trips, build itineraries, track budgets, save destinations to a wishlist, and keep all your travel details organized in one place.",
        path: "/travel",
        status: "coming-soon",
    },
    {
        title: "Profile",
        description: "Manage your account settings, display name, and personal preferences.",
        path: "/profile",
        status: "available",
    },
];

export default function Home() {
    const { profileData } = useProfile();
    const displayName = profileData?.displayName;

    return (
        <div className={styles.home}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    {displayName ? (
                        <>
                            Welcome back, <span className={styles.heroName}>{displayName}</span>
                        </>
                    ) : (
                        "Welcome back"
                    )}
                </h1>
                <p className={styles.heroSubtitle}>
                    Your personal hub for organizing life.
                </p>
            </header>

            <section className={styles.cardGrid}>
                {features.map((feature) => {
                    const isComingSoon = feature.status === "coming-soon";
                    return (
                        <Link
                            key={feature.path}
                            to={feature.path}
                            className={`${styles.card} ${isComingSoon ? styles.cardDisabled : ""}`}
                        >
                            <div className={styles.cardAccent} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>{feature.title}</h2>
                                    {isComingSoon && (
                                        <span className={styles.tag}>Coming Soon</span>
                                    )}
                                </div>
                                <p className={styles.cardDescription}>{feature.description}</p>
                                <span className={styles.cardLinkText}>
                                    {isComingSoon ? "Preview →" : "Open →"}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </section>
        </div>
    );
}