import { useLocation } from "react-router-dom";
import { nutrientOptions } from "../../../constants/edamam";
import styles from "../Meals.module.css";

export default function RecipePage() {
    const location = useLocation();
    const { recipe } = location.state;

    const { label, calories, cautions, cuisineType, dietLabels, dishType, healthLabels, images, ingredients, mealType, shareAs, source,
        totalDaily, totalNutrients, totalTime, totalWeight, uri, url, yield: servings
     } = recipe;

     const {height: imgHeight, width: imgWidth, url: imgURL} = images.REGULAR;

    return (
        <div className={styles.recipePage}>
            <img src={imgURL}/>
            <h1>{label}</h1>
            <p>Calories: {Math.round(calories)}</p>
            {cautions.map(caution => <p>{caution}</p>)}
            {cuisineType.map(type => <p>{type}</p>)}
            {dietLabels.map(label => <p>{label}</p>)}
            {dishType.map(type => <p>{type}</p>)}
            {healthLabels.map(label => <p>{label}</p>)}
            {ingredients.map(ing => {
                const {food, foodCategory, foodId, image, measure, quantity, text, weight } = ing;
                return <p>{text}</p>;
            })}
            {mealType.map(type => <p>{type}</p>)}
            <p>{shareAs}</p>
            <p>{source}</p>
            <p>{totalTime} minutes</p>
            <p>{totalWeight}</p>
            <p>{uri}</p>
            <p>{url}</p>
            <p>{servings}</p>
        </div>
    );
};

// <span>{}</span>
// {.map( => <span>{}</span>)}

