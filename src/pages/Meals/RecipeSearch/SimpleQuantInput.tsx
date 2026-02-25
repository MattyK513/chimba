import { useState } from "react";

export default function SimpleQuantInput({ type }: {type: "time" | "calories" | "ingr"}) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    const name = min !== "" || max !== "" ? type : undefined;

    const value = min !== "" && max !== "" ? `${min}-${max}`
        : min !== "" ? `${min}+`
        : max !== "" ? max
        : undefined;

    return (
        <>
            <label>
                From
                <input
                    id={`${type}-min`}
                    type="number"
                    value={min}
                    min="0"
                    max={max !== "" ? max : undefined}
                    onChange={e => setMin(e.target.value)}
                 />
            </label>
            <label>
                To
                <input
                    id={`${type}-max`}
                    type="number"
                    value={max}
                    min={min !== "" ? min : 0}
                    onChange={e => setMax(e.target.value)}
                 />
            </label>

            {name && value && <input type="hidden" name={name} value={value} />}
        </>
    );
};