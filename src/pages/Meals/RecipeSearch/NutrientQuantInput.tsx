import { useState } from "react";
import type { NutrientOption } from "../../../types";

export default function NutrientQuantInput({ parameter, label, unit }: NutrientOption) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const name = min !== "" || max !== "" ? `nutrients[${parameter}]` : undefined;

    const value = min !== "" && max !== "" ? `${min}-${max}`
        : min !== "" ? `${min}+`
        : max !== "" ? max
        : undefined;

    return (
        <>
            <span>{label}</span>
            <label>
                From
                <input
                    id={`${parameter}-min`}
                    type="number"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={e => setMin(e.target.value)}
                />
                {unit}
            </label>
            <label>
                To
                <input
                    id={`${parameter}-max`}
                    type="number"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={e => setMax(e.target.value)}
                    />
                {unit}
            </label>

            {name && value && <input type="hidden" name={name} value={value} />}
        </>
    );
};