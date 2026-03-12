import { useEffect, useRef } from "react";
import { Link, type FetcherWithComponents } from "react-router-dom";
import type { EdamamHit, EdamamResponse, NutrientCode } from "../../../types";
import styles from "../Meals.module.css";

export default function SearchResults({ response, hits, fetcher }: {response: EdamamResponse, hits: EdamamHit[], fetcher: FetcherWithComponents<EdamamResponse>}) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    console.log(response)
    console.log(hits)
    const { submit } = fetcher;

    const macros: NutrientCode[] = ["PROCNT", "FAT", "CHOCDF", "FIBTG", "SUGAR"];
    const micros: NutrientCode[] = ["CHOLE", "NA", "CA", "MG", "K", "FE"];

    useEffect(() => {
        console.log("useEffect ran")
        if (!sentinelRef.current) return;

        console.log("sentinelRef.current was defined")
        const observer = new IntersectionObserver(entries => {
            const entry = entries[0];
            console.log("sentinel was triggered")
            if (
                entry.isIntersecting &&
                response._links?.next?.href &&
                fetcher.state === "idle"
            ) {
                console.log("everything ran")
                submit({nextURL: response._links?.next?.href}, {method: "post", action: "/meal-planner/recipe-search"});
            }
        });
        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [response._links?.next?.href, hits.length]);

    if (!fetcher.data?.hits.length) return <span>No results</span>

    const resultCards = hits.map(result => {
        const id = result.recipe.uri.split("#recipe_")[1];
        const { recipe } = result;
        const { images, label, dietLabels, cautions, totalDaily, totalNutrients, calories, source } = recipe;
        const servings = recipe.yield || 1;

        const dietLabelDisplay = dietLabels.map(label => {
            return (
                <li key={label}>{label}</li>
            )
        });
        const cautionDisplay = cautions.map(caution => {
            return (
                <li key={caution}>{caution}</li>
            )
        });
        const macronutrientDisplay = macros.map(nutrient => {
            const n = totalNutrients[nutrient];
            if (!n) return null;
            return (
                <li key={nutrient} className={styles.cardNutrient}>
                    <span>
                        {n.label}
                    </span>
                    <span>
                        <strong>{`${(n.quantity / servings).toFixed(1)} ${n.unit}`}</strong>
                    </span>
                </li>
            )
        });
        const micronutrientDisplay = micros.map(nutrient => {
            const n = totalDaily[nutrient];
            if (!n) return null;
            return (
                <li key={nutrient} className={styles.cardNutrient}>
                    <span>
                        {n.label}
                    </span>
                    <span>
                        <strong>{`${Math.round(n.quantity / servings)}%`}</strong>
                    </span>
                </li>
            )
        });


        return (
            <article className={styles.resultCard} key={id}>
                <Link to={id} state={result} className={styles.resultCardLink}>
                    <div className={styles.cardHeader}>
                        <img src={images.SMALL.url} className={styles.cardPhoto} alt={label} />
                            <div className={styles.cardMainInfo}>
                                <h3>{label}</h3>
                                <span>{`from ${source}`}</span>
                            </div>
                    </div>
                    <div className={styles.cardTags}>
                        <ul className={styles.cardHealthLabels}>
                            {dietLabelDisplay}
                        </ul>
                        <ul className={styles.cardCautions}>
                            {cautionDisplay}
                        </ul>
                    </div>
                    <div className={styles.cardNutritionFacts}>
                        <div className={styles.cardCaloriesAndServings}>
                            <span>{`${servings} servings`}</span>
                            <span className={styles.cardCalories}><span>{Math.round(calories / servings)}</span> kCal per serving</span>
                        </div>
                        <ul className={styles.cardNutrientList}>
                            {macronutrientDisplay}
                        </ul>
                        <ul className={styles.cardNutrientList}>
                            {micronutrientDisplay}
                        </ul>
                    </div>
                </Link>
            </article>
        );
    });
    
    return (
        <>
            {resultCards}
            <div ref={sentinelRef} className={styles.sentinel} />
        </>
    );
};