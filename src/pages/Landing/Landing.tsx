import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

export default function Landing() {
    return (
        <main className="authShell">
            <section className="authCard section page">
                <h1>Welcome to Chimba</h1>
                <p className="subtle">A calm workspace for goals, travel plans, and meal prep.</p>
                <div className={styles.actions}>
                    <Link className={styles.linkButton} to="/login">Sign in</Link>
                    <Link className={`${styles.linkButton} ${styles.secondary}`} to="/register">Create account</Link>
                </div>
            </section>
        </main>
    )
};
