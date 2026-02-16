import { Form } from "react-router-dom";
import KeywordSearchPanel from "./KeywordSearchPanel";
import ClickableParamPanel from "./ClickableParamPanel";
import { allergyOptions } from "../../../constants/edamam";

export default function RecipeSearch() {
    return (
        <Form method="post">
            <KeywordSearchPanel />
            <ClickableParamPanel params={allergyOptions} />

            <button type="submit">Search</button>
        </Form>
    );
};