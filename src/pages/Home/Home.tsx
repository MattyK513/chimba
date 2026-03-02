import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const modules = [
    { title: "Goals", description: "Track priorities and habits in one place.", to: "/goals" },
    { title: "Travel", description: "Map your next trip and keep plans organized.", to: "/travel" },
    { title: "Meals", description: "Discover recipes and plan nutrition faster.", to: "/meal-planner" },
    { title: "Profile", description: "Update your personal details and settings.", to: "/profile" },
];

export default function Home() {
    return (
        <section className={`pageShell ${styles.home}`}>
            <p className={styles.eyebrow}>Dashboard</p>
            <h1>Welcome back to Chimba</h1>
            <p className={styles.subtitle}>Your all-in-one space for lifestyle planning. Pick a module to continue.</p>

            <div className={styles.grid}>
                {modules.map((module) => (
                    <Link to={module.to} className={styles.card} key={module.title}>
                        <h2>{module.title}</h2>
                        <p>{module.description}</p>
                        <span>Open module →</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
