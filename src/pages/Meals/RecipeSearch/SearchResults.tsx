import type { EdamamResponse } from "../../../types";

export default function SearchResults({ response }: {response: EdamamResponse}) {

    const hits = response?.hits;

    const resultsDisplay = hits?.map((result, i) => {
        return <p key={result.recipe.uri}>{i + 1}: {result.recipe.label}</p>
    });
    
    return (
        <>{resultsDisplay}</>
    );
};