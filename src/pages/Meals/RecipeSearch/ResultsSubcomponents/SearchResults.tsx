import { Link } from "react-router-dom";
import useInfiniteScroll from "../../../../hooks/useInfiniteScroll";
import useScrollRestore from "../../../../hooks/useScrollRestore";
import RateLimitNotice from "./RateLimitNotice";
import type {
    EdamamHit,
    FetcherSubmitFunction,
    NutrientCode,
} from "../../../../types";
import styles from "./SearchResults.module.css";

const macros: NutrientCode[] = ["PROCNT", "FAT", "CHOCDF", "FIBTG", "SUGAR"];
const micros: NutrientCode[] = ["CHOLE", "NA", "CA", "MG", "K", "FE"];

interface Props {
    hits: EdamamHit[];
    submit: FetcherSubmitFunction;
    numResults: number;
    fetcherState: "idle" | "loading" | "submitting";
    nextURL: string | null;
    paginationError: boolean;
    searchIsDisabled: boolean;
}

export default function SearchResults({
    hits,
    submit,
    numResults,
    fetcherState,
    nextURL,
    paginationError,
    searchIsDisabled,
}: Props) {
    const sentinelRef = useInfiniteScroll({
        nextURL,
        enabled: !paginationError,
        fetcherState,
        submit,
        action: "/meal-planner/recipe-search",
    });
    const { registerItem, markItemAsViewed } = useScrollRestore(
        "recipe-search:last-viewed",
        hits
    );

    if (numResults === 0) {
        return (
            <div className={styles.noResults}>
                <h2 className={styles.noResultsTitle}>No results</h2>
                <p className={styles.noResultsText}>
                    No recipes matched your search. Try adjusting your filters
                    or keywords.
                </p>
            </div>
        );
    }

    const resultCards = hits.map((result) => {
        const { recipe } = result;
        const {
            images,
            label,
            dietLabels,
            cautions,
            totalDaily,
            totalNutrients,
            calories,
            source,
            id,
        } = recipe;
        const servings = recipe.yield || 1;

        const dietLabelDisplay = dietLabels.map((label) => {
            return <li key={label}>{label}</li>;
        });
        const cautionDisplay = cautions.map((caution) => {
            return <li key={caution}>{caution}</li>;
        });
        const macronutrientDisplay = macros.map((nutrient) => {
            const n = totalNutrients[nutrient];
            if (!n) return null;
            return (
                <li key={nutrient} className={styles.cardNutrient}>
                    <span>{n.label}</span>
                    <span>
                        <strong>{`${(n.quantity / servings).toFixed(1)} ${n.unit}`}</strong>
                    </span>
                </li>
            );
        });
        const micronutrientDisplay = micros.map((nutrient) => {
            const n = totalDaily[nutrient];
            if (!n) return null;
            return (
                <li key={nutrient} className={styles.cardNutrient}>
                    <span>{n.label}</span>
                    <span>
                        <strong>{`${Math.round(n.quantity / servings)}%`}</strong>
                    </span>
                </li>
            );
        });
        return (
            <article
                className={styles.resultCard}
                key={id}
                ref={(node) => registerItem(id, node)}
            >
                <Link
                    to={id}
                    state={result}
                    className={styles.resultCardLink}
                    onClick={() => markItemAsViewed(id)}
                >
                    <div className={styles.cardHeader}>
                        <img
                            src={images.SMALL.url}
                            className={styles.cardPhoto}
                            alt={label}
                        />
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
                            <span className={styles.cardCalories}>
                                <span>{Math.round(calories / servings)}</span>{" "}
                                kCal per serving
                            </span>
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
        <div className={styles.resultsContainer}>
            {resultCards}
            {nextURL && fetcherState === "idle" && !paginationError && (
                <div ref={sentinelRef} className={styles.sentinel} />
            )}
            {paginationError && (
                <RateLimitNotice
                    searchIsDisabled={searchIsDisabled}
                    fetcherState={fetcherState}
                    submit={submit}
                    nextURL={nextURL}
                />
            )}
        </div>
    );
}
