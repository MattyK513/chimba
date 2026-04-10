import type { FetcherSubmitFunction } from "../../../../types";
import styles from "./RateLimitNotice.module.css";

interface Props {
    searchIsDisabled: boolean;
    fetcherState: "idle" | "loading" | "submitting";
    submit: FetcherSubmitFunction;
    nextURL: string | null
}

export default function RateLimitNotice({searchIsDisabled, fetcherState, submit, nextURL}: Props) {
    function handleClick() {
        submit({nextURL: nextURL}, {method: "post", action: "/meal-planner/recipe-search"});
    }

    return (
        <div role="status" aria-live="polite" className={styles.noticeBody}>
            <h3 className={styles.noticeHeading}>Woah, slow down!</h3>
            <p className={styles.noticeText}>
                There have been too many requests to the Edamam search API.
                Please wait a minute to search again or continue fetching new results. In the meantime,
                you can peruse your existing search results.
            </p>
            {nextURL && <button disabled={searchIsDisabled || fetcherState !== "idle"} onClick={handleClick} className={styles.searchBtn}>More results</button>}
        </div>
    );
}