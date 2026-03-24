import styles from "./Goals.module.css";

export default function Goals() {
    return (
        <section className={styles.comingSoonCard}>
            <h1>Goals</h1>
            <p>
                This module will help you set health goals, break them into milestones,
                and track your progress over time with actionable insights.
            </p>
            <p className={styles.comingSoonText}>Coming soon.</p>
        </section>
    );
}
