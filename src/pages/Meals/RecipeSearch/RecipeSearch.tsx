import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import KeywordSearchPanel from "./KeywordSearchPanel";
import ClickableParamPanel from "./ClickableParamPanel";
import QuantParamPanel from "./QuantParamPanel";
import SearchResults from "./SearchResults";
import { allergyOptions, cuisineOptions, dietOptions, dishTypeOptions, mealTypeOptions, nutrientOptions } from "../../../constants/edamam";
import type { EdamamResponse } from "../../../types/edamam";
import type { FetcherWithComponents } from "react-router-dom";
import styles from "../Meals.module.css";

type MealsOutletContext = {
    fetcher: FetcherWithComponents<EdamamResponse>;
};

export default function RecipeSearch() {
    const [currentTab, setCurrentTab] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const { fetcher } = useOutletContext<MealsOutletContext>();

    const { data }: { data: EdamamResponse | undefined } = fetcher;
    const { Form, formAction, formData, formEncType, formMethod, json, load, reset, state, submit, text } = fetcher;

    return (  
        <>
            {!isHidden && <Form method="post" className={styles.searchForm} onSubmit={() => setIsHidden(true)}>
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
                
                <button type="submit">Search</button>
            </Form>}
            <div onClick={() => setIsHidden(prev => !prev)}>
                {isHidden ? "Expand search" : "Hide search"}
            </div>

            {data && <SearchResults response={data} />}
        </>

    );
};