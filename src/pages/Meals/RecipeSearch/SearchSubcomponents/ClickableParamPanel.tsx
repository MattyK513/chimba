import type {
    AllergyOption, CuisineOption, DietOption, DishTypeOption, MealTypeOption,
} from "../../../../types";
import styles from "../RecipeSearch.module.css";

type ParamOption =
    | AllergyOption | CuisineOption | DietOption | DishTypeOption | MealTypeOption;

interface ClickableParamPanelProps {
    params: ParamOption[];
}

export default function ClickableParamPanel({ params }: ClickableParamPanelProps) {
    return (
        <div className={styles.chipGroup}>
            {params.map((p) => {
                const id = `chip-${p.parameter}-${p.value}`;
                return (
                    <label key={p.value} htmlFor={id} className={styles.chip}>
                        <input
                            id={id}
                            type="checkbox"
                            name={p.parameter}
                            value={p.value}
                        />
                        <span>{p.label}</span>
                    </label>
                );
            })}
        </div>
    );
}