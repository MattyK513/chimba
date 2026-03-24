import styles from "./Travel.module.css";

export default function Travel() {
    return (
        <section className={styles.comingSoonCard}>
            <h1>Travel planner</h1>
            <p>
                This module will help you coordinate meals, shopping, and nutrition goals while traveling,
                so your plans stay realistic wherever you are.
            </p>
            <p className={styles.comingSoonText}>Coming soon.</p>
        </section>
    );
}
