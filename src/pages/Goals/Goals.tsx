import styles from "../PlaceholderPage.module.css";

const plannedFeatures = [
    {
        title: "Goal Creation",
        description: "Define goals with titles, descriptions, deadlines, and categories.",
    },
    {
        title: "Progress Tracking",
        description: "Break goals into subtasks and watch your progress fill in over time.",
    },
    {
        title: "Streaks & Habits",
        description: "Turn recurring goals into habits and build streaks to stay consistent.",
    },
    {
        title: "Insights",
        description: "See trends in what you're working toward and how much you're accomplishing.",
    },
];

export default function Goals() {
    return (
        <div className={styles.page}>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>Goals</h1>
                <span className={styles.tag}>Coming Soon</span>
            </div>

            <p className={styles.subtitle}>
                A full goal-setting and tracking experience is in development. Here's a sneak peek
                at what we're working towards.
            </p>

            <section className={styles.featureList}>
                {plannedFeatures.map((feature) => (
                    <div key={feature.title} className={styles.featureCard}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}