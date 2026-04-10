import { useState } from "react";
import styles from "../../Meals.module.css";

export default function SimpleQuantInput({ type }: {type: "time" | "calories" | "ingr"}) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const name = min !== "" || max !== "" ? type : undefined;

    const value = min !== "" && max !== "" ? `${min}-${max}`
        : min !== "" ? `${min}+`
        : max !== "" ? max
        : undefined;

    const panelLabels = {
        time: "Cooking time",
        calories: "Calories",
        ingr: "Number of ingredients"
    };

    return (
        <div className={styles.quantPanel}>
            <span className={styles.quantLabel}>{panelLabels[type]}</span>
            <label>
                <span>From:</span>
                <input
                    id={`${type}-min`}
                    type="number"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={e => setMin(e.target.value)}
                 />
                 {type === "time" && <span className={styles.unit}>min</span>}
            </label>
            <label>
                <span className={styles.toLabel}>To:</span>
                <input
                    id={`${type}-max`}
                    type="number"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={e => setMax(e.target.value)}
                 />
                 {type === "time" && <span className={styles.unit}>min</span>}
            </label>

            {name && value && <input type="hidden" name={name} value={value} />}
        </div>
    );
};