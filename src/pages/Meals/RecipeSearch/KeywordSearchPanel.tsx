import styles from "../Meals.module.css";

export default function KeywordSearchPanel() {
    return (
        <div className={styles.keywordContainer}>
            <label htmlFor="keyword-search">
                Keyword search
                <input type="text" name="q" id="keyword-search"></input>
            </label>
        </div>
    );
};