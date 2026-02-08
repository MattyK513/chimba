import { Form } from "react-router-dom";
import { addGoal } from "../../services/firestore";
import useGoals from "../../hooks/useGoals";
import type { ActionFunctionArgs } from "../../types/firebase";

export async function action({request}: ActionFunctionArgs) {
    const data = await request.formData();
    const title = data.get("title");

    if (typeof title !== "string" || title.trim() === "") {
        return null;
    }

    await addGoal(title);
};

export default function Goals() {
    const { goals, loading } = useGoals();

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
            {loading ? <p>Loading...</p> : goalDisplay}
            <Form method="post">
                <input name="title" placeholder="Enter a goal" type="text"></input>
                <button type="submit">Create goal</button>
            </Form>
        </>
    );
};