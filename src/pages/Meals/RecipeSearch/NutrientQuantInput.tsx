import { useState } from "react";
import type { NutrientOption } from "../../../types";
import styles from "../Meals.module.css";

export default function NutrientQuantInput({ parameter, label, unit }: NutrientOption) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const name = min !== "" || max !== "" ? `nutrients[${parameter}]` : undefined;

    const value = min !== "" && max !== "" ? `${min}-${max}`
        : min !== "" ? `${min}+`
        : max !== "" ? max
        : undefined;

    return (
        <div className={`${styles.quantPanel} ${styles.badge}`}>
            <span className={styles.quantLabel}>{label}</span>
            <label>
                <span>From:</span>
                <input
                    id={`${parameter}-min`}
                    type="number"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={e => setMin(e.target.value)}
                />
                <span className={styles.unit}>{unit}</span>
            </label>
            <label>
                <span className={styles.toLabel}>To:</span>
                <input
                    id={`${parameter}-max`}
                    type="number"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={e => setMax(e.target.value)}
                    />
                <span className={styles.unit}>{unit}</span>
            </label>

            {name && value && <input type="hidden" name={name} value={value} />}
        </div>
    );
};