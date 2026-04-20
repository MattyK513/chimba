import { useEffect, useRef, useState } from "react";
import type { NutrientOption } from "../../../../types";
import styles from "../RecipeSearch.module.css";

export default function NutrientQuantInput({
    parameter,
    label,
    unit,
}: NutrientOption) {
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

    const name =
        min !== "" || max !== "" ? `nutrients[${parameter}]` : undefined;
    const value =
        min !== "" && max !== ""
            ? `${min}-${max}`
            : min !== ""
              ? `${min}+`
              : max !== ""
                ? max
                : undefined;

    return (
        <div className={styles.nutrientCard}>
            <div className={styles.nutrientCardHeader}>
                <span className={styles.nutrientCardLabel}>{label}</span>
                <span className={styles.rangeUnit}>{unit}</span>
            </div>
            <div className={styles.rangeInputs}>
                <input
                    ref={minRef}
                    id={`${parameter}-min`}
                    type="number"
                    aria-label={`${label} minimum (${unit})`}
                    placeholder="min"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={(e) => setMin(e.target.value)}
                    className={styles.rangeInput}
                />
                <span className={styles.rangeSeparator}>–</span>
                <input
                    id={`${parameter}-max`}
                    type="number"
                    aria-label={`${label} maximum (${unit})`}
                    placeholder="max"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={(e) => setMax(e.target.value)}
                    className={styles.rangeInput}
                />
            </div>
            {name && value && <input type="hidden" name={name} value={value} />}
        </div>
    );
}
