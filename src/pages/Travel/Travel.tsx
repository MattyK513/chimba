import styles from "./Travel.module.css";

export default function Travel() {
    return (
        <main className="page">
            <section className={`section ${styles.wrap}`}>
                <h1>Travel planner</h1>
                <p className="subtle">Keep route notes, destination ideas, and logistics in one place.</p>
            </section>
        </main>
    )
};
