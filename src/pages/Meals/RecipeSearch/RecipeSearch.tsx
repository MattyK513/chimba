import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { FetcherWithComponents } from "react-router-dom";
import { allergyOptions, cuisineOptions, dietOptions, dishTypeOptions, mealTypeOptions, nutrientOptions } from "../../../constants/edamam";
import { resetRecipeSearchState } from "../../../services/edamam";
import type { Dispatch, EdamamHit, RecipeSearchActionResponse, RecipeSearchErrorPayload, SetStateAction } from "../../../types";
import styles from "../Meals.module.css";
import ClickableParamPanel from "./ClickableParamPanel";
import KeywordSearchPanel from "./KeywordSearchPanel";
import QuantParamPanel from "./QuantParamPanel";
import SearchResults from "./SearchResults";

type MealsOutletContext = {
    fetcher: FetcherWithComponents<RecipeSearchActionResponse>;
    allHits: EdamamHit[];
    setAllHits: Dispatch<SetStateAction<EdamamHit[]>>;
};

export default function RecipeSearch() {
    const [currentTab, setCurrentTab] = useState("");
    const [searchIsHidden, setsearchIsHidden] = useState(false);
    const { fetcher, allHits, setAllHits } = useOutletContext<MealsOutletContext>();
    const { data } = fetcher;
    const { Form, state: fetcherState, submit } = fetcher;

    const searchResults = useMemo(() => {
        if (!data || !data.ok) {
            return null;
        }

        return data.results;
    }, [data]);

    const searchError = useMemo<RecipeSearchErrorPayload | null>(() => {
        if (!data || data.ok) {
            return null;
        }

        return data.error;
    }, [data]);

    const nextURL = searchResults?._links?.next?.href || null;

    useEffect(() => {
        if (!searchResults || searchResults.count <= 0) {
            return;
        }

        setsearchIsHidden(true);

        setAllHits((prev) => {
            const existing = new Set(
                prev.map((hit) => hit.recipe.uri)
            );
            const newHits = searchResults.hits.filter((hit) =>
                !existing.has(hit.recipe.uri)
            );
            return [...prev, ...newHits];
        });
    }, [searchResults, setAllHits]);

    return (
        <>
            <Form
                method="post"
                className={styles.searchForm}
                hidden={searchIsHidden}
                onSubmit={() => { resetRecipeSearchState(setAllHits); }}
            >
                <KeywordSearchPanel />

                <hr className={styles.formDivider} />

                <details open={currentTab === "diet"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("diet"); }}>
                    <summary>Diet options</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={dietOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "nutrition"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("nutrition"); }}>
                    <summary>Nutrition</summary>
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="calories" />
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="nutrients" params={nutrientOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "cooking"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("cooking"); }}>
                    <summary>Cooking constraints</summary>
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="time" />
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="ingr" />
                    <hr className={styles.subFormDivider} />
                    <span>Meal type</span>
                    <ClickableParamPanel params={mealTypeOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "allergy"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("allergy"); }}>
                    <summary>Allergy considerations</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={allergyOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "cuisine"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("cuisine"); }}>
                    <summary>Cuisines</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={cuisineOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "dish"} onToggle={(e) => { if (e.currentTarget.open) setCurrentTab("dish"); }}>
                    <summary>Dish types</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={dishTypeOptions} />
                </details>

                <hr className={styles.formDivider} />

                <button type="submit" disabled={fetcher.state !== "idle"}>
                    {fetcher.state === "idle" ? "Search" : "Submitting"}
                </button>
                <button type="reset" disabled={fetcher.state !== "idle"}>
                    Clear search
                </button>
            </Form>
            {searchResults && searchResults.hits.length > 0 && <div onClick={() => setsearchIsHidden((prev) => !prev)} className={`${styles.searchToggle} ${searchIsHidden ? styles.expand : styles.hide}`}>
                {searchIsHidden ? "Show search panel" : "Hide search panel"}
            </div>}

            {searchResults && (
                <SearchResults
                    hits={allHits}
                    submit={submit}
                    numResults={searchResults.hits.length}
                    fetcherState={fetcherState}
                    nextURL={nextURL}
                    rateLimitError={searchError?.isRateLimit ? searchError : null}
                />
            )}

            {!searchResults && searchError && !searchError.isRateLimit && (
                <div className={styles.searchErrorNotice}>
                    <strong>Couldn&apos;t complete your request.</strong>
                    <p>{searchError.message}</p>
                </div>
            )}
        </>
    );
}
