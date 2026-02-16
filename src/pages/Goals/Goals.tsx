import { Form } from "react-router-dom";
import useGoals from "../../hooks/useGoals";

export default function Goals() {
    const { goals } = useGoals();

    const goalDisplay = goals?.map(goal => {
        return (
            <div key={goal.id}>
                <span>{goal.title}</span>
            </div>
        );
    });

    return (
        <>
            <h1>Goals page</h1>
            {goalDisplay}
            <Form method="post">
                <input name="title" placeholder="Enter a goal" type="text"></input>
                <button type="submit">Create goal</button>
            </Form>
        </>
    );
};