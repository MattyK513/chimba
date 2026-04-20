import styles from "../RecipeSearch.module.css";

export default function KeywordSearchPanel() {
    return (
        <div className={styles.keywordField}>
            <label htmlFor="keyword-search" className={styles.keywordLabel}>
                Keyword
            </label>
            <input
                id="keyword-search"
                type="text"
                name="q"
                placeholder="e.g. chicken tikka masala"
                className={styles.keywordInput}
            />
        </div>
    );
}
