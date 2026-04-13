import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import KeywordSearchPanel from "./SearchSubcomponents/KeywordSearchPanel";
import ClickableParamPanel from "./SearchSubcomponents/ClickableParamPanel";
import QuantParamPanel from "./SearchSubcomponents/QuantParamPanel";
import SearchResults from "./ResultsSubcomponents/SearchResults";
import {
    allergyOptions, cuisineOptions, dietOptions, dishTypeOptions,
    mealTypeOptions, nutrientOptions,
} from "../../../constants/edamam";
import { resetRecipeSearchState } from "../../../services/edamam";
import type {
    EdamamResponse, EdamamHit, InfiniteScrollErrorResponse,
    Dispatch, SetStateAction,
} from "../../../types";
import type { FetcherWithComponents } from "react-router-dom";
import styles from "./RecipeSearch.module.css";

type MealsOutletContext = {
    fetcher: FetcherWithComponents<EdamamResponse>;
    allHits: EdamamHit[];
    setAllHits: Dispatch<SetStateAction<EdamamHit[]>>;
    searchIsDisabled: boolean;
};

type SectionKey = "" | "diet" | "nutrition" | "cooking" | "allergy" | "cuisine" | "dish";

export default function RecipeSearch() {
    const [currentTab, setCurrentTab] = useState<SectionKey>("");
    const [searchIsHidden, setSearchIsHidden] = useState(false);
    const { fetcher, allHits, setAllHits, searchIsDisabled } =
        useOutletContext<MealsOutletContext>();
    const { data }: { data: EdamamResponse | InfiniteScrollErrorResponse | undefined } = fetcher;
    const { Form, state: fetcherState, submit } = fetcher;
    const paginationError = data && "error" in data ? true : false;

    let nextURL: string | null = null;
    if (data?._links?.next?.href) {
        nextURL = data._links.next.href;
    } else if (data && "nextURL" in data && typeof data.nextURL === "string") {
        nextURL = data.nextURL;
    }

    useEffect(() => {
        if (data && data.count > 0) {
            setSearchIsHidden(true);
            setAllHits(prev => {
                const seen = new Set(prev.map(hit => hit.recipe.uri));
                const newHits: EdamamHit[] = [];
                for (const hit of data.hits) {
                    if (!seen.has(hit.recipe.uri)) {
                        seen.add(hit.recipe.uri);
                        newHits.push(hit);
                    }
                }
                return [...prev, ...newHits];
            });
        }
    }, [data]);

    const onSectionToggle =
        (key: SectionKey) => (e: React.SyntheticEvent<HTMLDetailsElement>) => {
            if (e.currentTarget.open) setCurrentTab(key);
        };

    return (
        <div className={styles.recipeSearchPage}>
            <h1 className={styles.title}>Recipe Search</h1>
            <p className={styles.subtitle}>
                Search thousands of recipes and fine-tune your results with filters.
            </p>

            <Form
                method="post"
                className={styles.searchForm}
                hidden={searchIsHidden}
                onSubmit={() => { resetRecipeSearchState(setAllHits); }}
            >
                <KeywordSearchPanel />

                <details
                    className={styles.section}
                    open={currentTab === "diet"}
                    onToggle={onSectionToggle("diet")}
                >
                    <summary className={styles.sectionSummary}>Diet</summary>
                    <div className={styles.sectionContent}>
                        <ClickableParamPanel params={dietOptions} />
                    </div>
                </details>

                <details
                    className={styles.section}
                    open={currentTab === "nutrition"}
                    onToggle={onSectionToggle("nutrition")}
                >
                    <summary className={styles.sectionSummary}>Nutrition</summary>
                    <div className={styles.sectionContent}>
                        <QuantParamPanel type="calories" />
                        <QuantParamPanel type="nutrients" params={nutrientOptions} />
                    </div>
                </details>

                <details
                    className={styles.section}
                    open={currentTab === "cooking"}
                    onToggle={onSectionToggle("cooking")}
                >
                    <summary className={styles.sectionSummary}>Cooking constraints</summary>
                    <div className={styles.sectionContent}>
                        <QuantParamPanel type="time" />
                        <QuantParamPanel type="ingr" />
                        <span className={styles.sectionSubLabel}>Meal type</span>
                        <ClickableParamPanel params={mealTypeOptions} />
                    </div>
                </details>

                <details
                    className={styles.section}
                    open={currentTab === "allergy"}
                    onToggle={onSectionToggle("allergy")}
                >
                    <summary className={styles.sectionSummary}>Allergies</summary>
                    <div className={styles.sectionContent}>
                        <ClickableParamPanel params={allergyOptions} />
                    </div>
                </details>

                <details
                    className={styles.section}
                    open={currentTab === "cuisine"}
                    onToggle={onSectionToggle("cuisine")}
                >
                    <summary className={styles.sectionSummary}>Cuisines</summary>
                    <div className={styles.sectionContent}>
                        <ClickableParamPanel params={cuisineOptions} />
                    </div>
                </details>

                <details
                    className={styles.section}
                    open={currentTab === "dish"}
                    onToggle={onSectionToggle("dish")}
                >
                    <summary className={styles.sectionSummary}>Dish types</summary>
                    <div className={styles.sectionContent}>
                        <ClickableParamPanel params={dishTypeOptions} />
                    </div>
                </details>

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        className={styles.primaryBtn}
                        disabled={fetcherState !== "idle" || searchIsDisabled}
                    >
                        {fetcherState === "idle" ? "Search" : "Searching…"}
                    </button>
                    <button
                        type="reset"
                        className={styles.secondaryBtn}
                        disabled={fetcherState !== "idle"}
                    >
                        Clear
                    </button>
                </div>
            </Form>

            {data && data.hits?.length > 0 && (
                <button
                    type="button"
                    onClick={() => setSearchIsHidden(prev => !prev)}
                    className={styles.searchToggle}
                >
                    {searchIsHidden ? "Show search panel" : "Hide search panel"}
                </button>
            )}

            {data && (
                <SearchResults
                    hits={allHits}
                    submit={submit}
                    numResults={data.hits?.length}
                    fetcherState={fetcherState}
                    nextURL={nextURL}
                    paginationError={paginationError}
                    searchIsDisabled={searchIsDisabled}
                />
            )}
        </div>
    );
}