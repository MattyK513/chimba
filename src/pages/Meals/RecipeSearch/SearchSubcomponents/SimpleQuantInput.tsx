import { useEffect, useRef, useState } from "react";
import styles from "../RecipeSearch.module.css";

const panelLabels = {
    time: "Cooking time",
    calories: "Calories",
    ingr: "Number of ingredients",
} as const;

const unitLabels: Partial<Record<"time" | "calories" | "ingr", string>> = {
    time: "min",
};

export default function SimpleQuantInput({ type }: { type: "time" | "calories" | "ingr" }) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const minRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const form = minRef.current?.form;
        if (!form) return;
        const handleReset = () => {
            setMin("");
            setMax("");
        };
        form.addEventListener("reset", handleReset);
        return () => form.removeEventListener("reset", handleReset);
    }, []);

    const name = min !== "" || max !== "" ? type : undefined;
    const value =
        min !== "" && max !== "" ? `${min}-${max}`
        : min !== "" ? `${min}+`
        : max !== "" ? max
        : undefined;

    const unit = unitLabels[type];
    const label = panelLabels[type];

    return (
        <div className={styles.rangeField}>
            <span className={styles.rangeLabel}>
                {label}{unit ? ` (${unit})` : ""}
            </span>
            <div className={styles.rangeInputs}>
                <input
                    ref={minRef}
                    id={`${type}-min`}
                    type="number"
                    aria-label={`${label} minimum`}
                    placeholder="min"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={e => setMin(e.target.value)}
                    className={styles.rangeInput}
                />
                <span className={styles.rangeSeparator}>–</span>
                <input
                    id={`${type}-max`}
                    type="number"
                    aria-label={`${label} maximum`}
                    placeholder="max"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={e => setMax(e.target.value)}
                    className={styles.rangeInput}
                />
            </div>
            {name && value && <input type="hidden" name={name} value={value} />}
        </div>
    );
}