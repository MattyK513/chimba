import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import KeywordSearchPanel from "./SearchSubcomponents/KeywordSearchPanel";
import ClickableParamPanel from "./SearchSubcomponents/ClickableParamPanel";
import QuantParamPanel from "./SearchSubcomponents/QuantParamPanel";
import SearchResults from "./ResultsSubcomponents/SearchResults";
import { allergyOptions, cuisineOptions, dietOptions, dishTypeOptions, mealTypeOptions, nutrientOptions } from "../../../constants/edamam";
import { resetRecipeSearchState } from "../../../services/edamam";
import type { EdamamResponse, EdamamHit, InfiniteScrollErrorResponse, Dispatch, SetStateAction } from "../../../types";
import type { FetcherWithComponents } from "react-router-dom";
import styles from "../Meals.module.css";

type MealsOutletContext = {
    fetcher: FetcherWithComponents<EdamamResponse>;
    allHits: EdamamHit[];
    setAllHits: Dispatch<SetStateAction<EdamamHit[]>>;
    searchIsDisabled: boolean
};

export default function RecipeSearch() {
    const [currentTab, setCurrentTab] = useState("");
    const [searchIsHidden, setsearchIsHidden] = useState(false);
    const { fetcher, allHits, setAllHits, searchIsDisabled } = useOutletContext<MealsOutletContext>();
    const { data }: { data: EdamamResponse | InfiniteScrollErrorResponse | undefined } = fetcher;
    const { Form, state: fetcherState, submit } = fetcher;
    const paginationError = data && "error" in data ? true : false;

    let nextURL: string | null = null;

    if (data?._links?.next?.href) {
        nextURL = data._links.next.href;
    } else if (
        data &&
        "nextURL" in data &&
        typeof data.nextURL === "string"
    ) {
        nextURL = data.nextURL;
    }
    
    useEffect(() => {
        if (data && data.count > 0) {

            setsearchIsHidden(true);
            
            setAllHits(prev => {
                const existing = new Set(
                    prev.map(hit => hit.recipe.uri)
                );
                const newHits = data.hits.filter(hit => 
                    !existing.has(hit.recipe.uri)
                );
                return [...prev, ...newHits];
            });
        }
    }, [data]);

    return (  
        <>
            <Form
                method="post"
                className={styles.searchForm}
                hidden={searchIsHidden}
                onSubmit={() => {resetRecipeSearchState(setAllHits);}}
            >
                <KeywordSearchPanel />

                <hr className={styles.formDivider} />

                <details open={currentTab === "diet" } onToggle={e => {if (e.currentTarget.open) setCurrentTab("diet")}}>
                    <summary>Diet options</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={dietOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "nutrition"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("nutrition")}}>
                    <summary>Nutrition</summary>
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="calories" />
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="nutrients" params={nutrientOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "cooking"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("cooking")}}>
                    <summary>Cooking constraints</summary>
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="time"  />
                    <hr className={styles.subFormDivider} />
                    <QuantParamPanel type="ingr"  />
                    <hr className={styles.subFormDivider} />
                    <span>Meal type</span>
                    <ClickableParamPanel params={mealTypeOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "allergy"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("allergy")}}>
                    <summary>Allergy considerations</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={allergyOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "cuisine"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("cuisine")}}>
                    <summary>Cuisines</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={cuisineOptions} />
                </details>

                <hr className={styles.formDivider} />

                <details open={currentTab === "dish"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("dish")}}>
                    <summary>Dish types</summary>
                    <hr className={styles.subFormDivider} />
                    <ClickableParamPanel params={dishTypeOptions} />
                </details>

                <hr className={styles.formDivider} />
                
                <button type="submit" disabled={fetcher.state !== "idle" || searchIsDisabled}>
                    {fetcher.state === "idle" ? "Search" : "Submitting"}
                </button>
                <button type="reset" disabled={fetcher.state !== "idle"}>
                    Clear search
                </button>
            </Form>
            {data && data.hits?.length > 0 && <div onClick={() => setsearchIsHidden(prev => !prev)} className={`${styles.searchToggle} ${searchIsHidden ? styles.expand : styles.hide}`}>
                {searchIsHidden ? "Show search panel" : "Hide search panel"}
            </div>}

            {data && <SearchResults hits={allHits} submit={submit} numResults={data.hits?.length} fetcherState={fetcherState} nextURL={nextURL} paginationError={paginationError} searchIsDisabled={searchIsDisabled}/>}
        </>
    );
};