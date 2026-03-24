import { useEffect } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { addIngredientToGroceryList } from "../../../services/edamam";
import type { EdamamHit } from "../../../types";
import styles from "../Meals.module.css";
import NutritionFacts from "./NutritionFacts";

export default function RecipePage() {
    const location = useLocation();
    const loaderData = useLoaderData();
    const { recipe } = (loaderData ?? location.state) as EdamamHit;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const {
        label,
        calories,
        cautions,
        cuisineType,
        dietLabels,
        dishType,
        healthLabels,
        images,
        ingredients,
        source,
        totalDaily,
        totalNutrients,
        totalTime,
        url,
        yield: servings
    } = recipe;

    const { url: imgURL } = images.REGULAR;

    const ingredientDisplay = ingredients.map((ing) => {
        const { text, food } = ing;
        return (
            <li key={food} onClick={() => addIngredientToGroceryList(ing)}>
                <span>{text}</span>
            </li>
        );
    });

    const cuisineTypeDisplay = cuisineType.map((cuisine) => (
        <div key={cuisine} className={styles.cuisineTag}>{cuisine}</div>
    ));

    const dishTypeDisplay = dishType.map((dish) => (
        <div key={dish} className={styles.dishTag}>{dish}</div>
    ));

    const renderTags = () => {
        const display = [];
        display.push(...cautions.map((caution) => <div key={caution} className={styles.cautionTag}>{caution}</div>));
        display.push(...dietLabels.map((diet) => <div key={diet} className={styles.dietTag}>{diet}</div>));
        display.push(...healthLabels.map((health) => <div key={health} className={styles.healthTag}>{health}</div>));
        return display;
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 60);
        const mins = time % 60;
        const hourString = hours > 0 ? `${hours}h ` : "";
        const minString = `${mins}m`;

        return hourString + minString;
    };

    return (
        <div className={styles.recipePage}>
            <img src={imgURL} alt={label} className={styles.pagePhoto} />
            <h1 className={styles.pageTitle}>{label}</h1>
            <p>Full recipe available from <a href={url} target="_blank" rel="noopener noreferrer">{source}</a></p>
            <div className={styles.pageCuisineAndDishTagContainer}>
                <div>
                    {cuisineTypeDisplay}
                </div>
                <div>
                    {dishTypeDisplay}
                </div>
            </div>
            {totalTime > 0 && <p className={styles.pageCookTime}>Total time: {formatTime(totalTime)}</p>}
            <h3>Ingredients</h3>
            <ul className={styles.ingredientList}>
                {ingredientDisplay}
            </ul>
            <div className={styles.nutritionContainer}>
                {location.state || loaderData
                    ? <NutritionFacts nutrients={totalNutrients} daily={totalDaily} calories={calories} servings={servings} />
                    : <span>Loading...</span>
                }
            </div>
            <div className={styles.tagContainer}>
                {renderTags()}
            </div>
        </div>
    );
}
