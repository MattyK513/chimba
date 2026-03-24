import useAuth from "../../../hooks/useAuth";
import useMeals from "../../../hooks/useMeals";

export default function WeeklyPlanner() {
    const { user } = useAuth();
    if (!user) throw new Error("Log in, B")
    const { mealPlans, setMeal } = useMeals();

    let currentDate = new Date();

    const formattedDate = [
        String(currentDate.getDate()).padStart(2, "0"),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        currentDate.getFullYear()
        ].join("-");

    console.log(mealPlans)
    console.log(formattedDate)
    
    return (
        <button onClick={() => setMeal(user?.uid, "24-03-2026", {"breakfast": {recipeLabel: "eggs"}})}>add test meal</button>
    )
};