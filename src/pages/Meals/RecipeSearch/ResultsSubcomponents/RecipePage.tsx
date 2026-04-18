import { useEffect} from "react";
import { useLocation, useLoaderData } from "react-router-dom";
import { addIngredientToGroceryList } from "../../../../services/edamam";
import { formatTime } from "../../../../utils/formatTime";
import NutritionFacts from "./NutritionFacts";
import { Spinner } from "../../../../components";
import type { EdamamHit } from "../../../../types";
import styles from "./RecipePage.module.css";

export default function RecipePage() {
    const location = useLocation();
    const loaderData = useLoaderData();
    const { recipe } = (loaderData ?? location.state) as EdamamHit;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto"});
     }, []);

    const { label, calories, cautions, cuisineType, dietLabels, dishType, healthLabels, images, ingredients, source,
        totalDaily, totalNutrients, totalTime, url, yield: servings
     } = recipe;
     
     const imgURL = images.REGULAR.url;

     const ingredientDisplay = ingredients.map(ing => {
        const { text, food } = ing;
        return (
            <li key={food} onClick={() => addIngredientToGroceryList(ing)}>
                <span>{text}</span>
            </li>
        );
     });
     
     const cuisineTypeDisplay = cuisineType.map(cuisine => {
        return (
            <div key={cuisine} className={styles.cuisineTag}>{cuisine}</div>
        );
     });

     const dishTypeDisplay = dishType.map(dish => {
        return (
            <div key={dish} className={styles.dishTag}>{dish}</div>
        );
     });

     const renderTags = () => {
        const display = [];
        display.push(...cautions.map(caution => <div key={caution} className={styles.cautionTag}>{caution}</div>));
        display.push(...dietLabels.map(diet => <div key={diet} className={styles.dietTag}>{diet}</div>));
        display.push(...healthLabels.map(health => <div key={health} className={styles.healthTag}>{health}</div>));
        return display;
     };

    return (
        <div className={styles.recipePage}>
            <div className={styles.pageHeader}>
                <img src={imgURL} alt={label} className={styles.pagePhoto} />
                <div className={styles.headerInfo}>
                    <h1 className={styles.pageTitle}>{label}</h1>
                    <p>Full recipe available from <a href={url} target="_blank" rel="noopener noreferrer">{source}</a></p>
                    <div className={styles.cuisineAndDishTagContainer}>
                        <div>
                            {cuisineTypeDisplay}
                        </div>
                        <div>
                            {dishTypeDisplay}
                        </div>
                    </div>
                    {totalTime > 0 && <p className={styles.pageCookTime}>Total time: {formatTime(totalTime)}</p>}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.bodyLeftColumn}>
                    <div className={styles.ingredientListContainer}>
                        <h3 className={styles.ingredientListHeading}>Ingredients</h3>
                        <ul className={styles.ingredientList}>
                            {ingredientDisplay}
                        </ul>
                    </div>
                    <div className={styles.tagsContainer}>
                        <h3 className={styles.tagsHeading}>Health Tags</h3>
                        <div className={styles.tagList}>
                            {renderTags()}
                        </div>
                    </div>
                </div>
                <div className={styles.bodyRightColumn}>
                    <div className={styles.nutritionFactsContainer}>
                        {location.state || loaderData
                        ? <NutritionFacts nutrients={totalNutrients} daily={totalDaily} calories={calories} servings={servings}/>
                        : <Spinner variant="inline" />
                    }
                    </div>
                </div>
            </div>
            
        </div>
    );
};