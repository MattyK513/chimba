import { Form } from "react-router-dom";
import useGoals from "../../hooks/useGoals";
import styles from "./Goals.module.css";

export default function Goals() {
    const { goals } = useGoals();

    return (
        <section className={`pageShell ${styles.goals}`}>
            <h1>Goal tracker</h1>
            <p>Capture your priorities and keep momentum visible.</p>

            <div className={styles.goalList}>
                {goals?.length ? goals.map((goal) => (
                    <div className={styles.goalItem} key={goal.id}>
                        <span>{goal.title}</span>
                    </div>
                )) : <p className={styles.emptyState}>No goals yet. Add your first one below.</p>}
            </div>

            <Form className={styles.form} method="post">
                <input name="title" placeholder="Enter a goal" type="text" required />
                <button type="submit">Create goal</button>
            </Form>
        </section>
    );
}
