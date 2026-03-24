import useMeals from "../../../hooks/useMeals";
import styles from "../Meals.module.css";

export default function GroceryList() {
    const { groceryList } = useMeals();

    return (
        <section className={styles.grocerySection}>
            <h2>Grocery list</h2>
            {!groceryList || groceryList.length === 0 ? (
                <p>No grocery items yet.</p>
            ) : (
                <ul className={styles.groceryList}>
                    {groceryList.map((item) => (
                        <li key={item.food} className={styles.groceryItem}>
                            <span className={styles.groceryFood}>{item.food}</span>
                            <span>
                                {item.quantity ?? "-"} {item.measure ?? ""}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
