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
    const { fetcher } = useOutletContext<MealsOutletContext>();

    const { data }: { data: EdamamResponse | undefined } = fetcher;
    const { Form } = fetcher;

    return (  
        <>
                <Form method="post" className={styles.searchForm}>
                <h1>Recipe Search</h1>
                <KeywordSearchPanel />
                <details open={currentTab === "diet" } onToggle={e => {if (e.currentTarget.open) setCurrentTab("diet")}}>
                    <summary>Diet options</summary>
                    <ClickableParamPanel params={dietOptions} />
                </details>
                <details open={currentTab === "nutrition"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("nutrition")}}>
                    <summary>Nutrition</summary>
                    <span>Calories</span>
                    <QuantParamPanel type="calories" />
                    <QuantParamPanel type="nutrients" params={nutrientOptions} />
                </details>
                <details open={currentTab === "cooking"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("cooking")}}>
                    <summary>Cooking constraints</summary>
                    <p>Cook time</p>
                    <QuantParamPanel type="time"  />
                    <p>Ingredient number</p>
                    <QuantParamPanel type="ingr"  />
                    <p>Meal type</p>
                    <ClickableParamPanel params={mealTypeOptions} />
                </details>
                <details open={currentTab === "allergy"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("allergy")}}>
                    <summary>Allergy considerations</summary>
                    <ClickableParamPanel params={allergyOptions} />
                </details>
                <details open={currentTab === "cuisine"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("cuisine")}}>
                    <summary>Cuisines</summary>
                    <ClickableParamPanel params={cuisineOptions} />
                </details>
                <details open={currentTab === "dish"} onToggle={e => {if (e.currentTarget.open) setCurrentTab("dish")}}>
                    <summary>Dish types</summary>
                    <ClickableParamPanel params={dishTypeOptions} />
                </details>
                
                <button type="submit">Search</button>
            </Form>

            {data && <SearchResults response={data} />}
        </>

    );
};