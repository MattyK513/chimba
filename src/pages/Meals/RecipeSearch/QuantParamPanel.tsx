// QuantParamPanel.tsx
import NutrientQuantInput from "./NutrientQuantInput";
import SimpleQuantInput from "./SimpleQuantInput";
import { sortNutrients } from "../../../services/edamam";
import type { NutrientOption } from "../../../types";

const groupLabels: Record<string, string> = {
    macros: "Macronutrients",
    vitamins: "Vitamins",
    minerals: "Minerals",
    other: "Other"
};

export default function QuantParamPanel({ type, params = null }: {type: "nutrients" | "calories" | "time" | "ingr", params?: NutrientOption[] | null}) {

    if (type !== "nutrients") {
        return (
            <div>
                <SimpleQuantInput type={type} />
            </div>
        );
    }

    if (!params) {
        throw new Error("QuantParamPanel with type 'nutrients' must include params prop.");
    }

    const grouped = sortNutrients(params);

    return (
        <>
            {Object.entries(grouped).map(([group, nutrients]) => (
                <details key={group}>
                    <summary>{groupLabels[group] ?? group}</summary>
                    {nutrients.map(p => (
                        <NutrientQuantInput key={p.parameter} {...p} />
                    ))}
                </details>
            ))}
        </>
    );
}
/*
import NutrientQuantInput from "./NutrientQuantInput";
import SimpleQuantInput from "./SimpleQuantInput";
import type { NutrientOption } from "../../../types/edamam";

export default function QuantParamPanel({ type, isDisplayed, params = null }: { type: "nutrients" | "calories" | "time" | "ingr", isDisplayed: boolean, params?: NutrientOption[] | null }) {
    if (!isDisplayed) return null;
    if (type !== "nutrients") {
        return (
            <div>
                <SimpleQuantInput type={type} />
            </div>
        );
    } else if (params) {
        const nutrientsDisplay = params.map(p => {
            const { parameter, label, unit } = p;
            return (
                <NutrientQuantInput key={parameter} parameter={parameter} label={label} unit={unit} />
            )
        });
        return nutrientsDisplay;
    } else {
        throw new Error("QuantParamPanel with type 'nutrient' must include params prop.");
    }
};
*/