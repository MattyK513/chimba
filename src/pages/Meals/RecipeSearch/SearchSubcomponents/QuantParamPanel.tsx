import NutrientQuantInput from "./NutrientQuantInput";
import SimpleQuantInput from "./SimpleQuantInput";
import { sortNutrients } from "../../../../services/edamam";
import { AppError } from "../../../../errors";
import type { NutrientOption } from "../../../../types";
import styles from "../RecipeSearch.module.css";

const groupOrder = ["macros", "vitamins", "minerals", "other"] as const;

const groupLabels: Record<string, string> = {
    macros: "Macronutrients",
    vitamins: "Vitamins",
    minerals: "Minerals",
    other: "Other",
};

interface Props {
    type: "nutrients" | "calories" | "time" | "ingr";
    params?: NutrientOption[] | null;
}

export default function QuantParamPanel({ type, params = null }: Props) {
    if (type !== "nutrients") {
        return <SimpleQuantInput type={type} />;
    }

    if (!params) {
        throw new AppError("COMPONENT_MISUSE", "QuantParamPanel with type 'nutrients' must include params prop.");
    }

    const grouped = sortNutrients(params);

    return (
        <>
            {groupOrder.map(group => {
                const nutrients = grouped[group];
                return (
                    <details key={group} className={styles.subSection}>
                        <summary className={styles.subSectionSummary}>
                            {groupLabels[group] ?? group}
                        </summary>
                        <div className={styles.nutrientGrid}>
                            {nutrients.map(p => (
                                <NutrientQuantInput key={p.parameter} {...p} />
                            ))}
                        </div>
                    </details>
                );
            })}
        </>
    );
}