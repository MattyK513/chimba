import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

export default function Landing() {
    return (
        <main className={`pageShell ${styles.landing}`}>
            <p className={styles.badge}>Lifestyle OS</p>
            <h1>Plan your goals, meals, and travel in one polished workspace.</h1>
            <p>
                Chimba helps you stay focused with a clean dashboard, fast workflows, and personal progress tracking.
            </p>
            <div className={styles.actions}>
                <Link className={styles.primaryAction} to="/login">Sign in</Link>
                <Link className={styles.secondaryAction} to="/register">Create account</Link>
            </div>
        </main>
    );
}
