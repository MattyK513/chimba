import styles from "./Home.module.css";

export default function Home() {
    return (
        <main className="page">
            <section className={`section ${styles.hero}`}>
                <h1>Home</h1>
                <p className="subtle">Welcome back. Pick a workspace in the nav and continue where you left off.</p>
            </section>
        </main>
    )
};
