import { Form } from "react-router-dom";
import useGoals from "../../hooks/useGoals";
import styles from "./Goals.module.css";

export default function Goals() {
    const { goals } = useGoals();

    const goalDisplay = goals?.map(goal => (
        <div key={goal.id} className={styles.goalItem}>
            <span>{goal.title}</span>
        </div>
    ));

    return (
        <main className="page">
            <section className="section page">
                <h1>Goals</h1>
                <p className="subtle">Track progress with a simple list you can keep iterating on.</p>
            </section>

            <section className={`section ${styles.goalList}`}>
                {goalDisplay}
            </section>

            <section className="section">
                <Form method="post" className="formStack">
                    <label className="formLabel">
                        New goal
                        <input name="title" placeholder="Enter a goal" type="text" />
                    </label>
                    <button type="submit">Create goal</button>
                </Form>
            </section>
        </main>
    );
};
