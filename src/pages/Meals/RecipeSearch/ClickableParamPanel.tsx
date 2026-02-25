import { InfoIcon } from "lucide-react";
import type { AllergyOption, CuisineOption, DietOption, DishTypeOption, MealTypeOption } from "../../../types";

type ParamOption = AllergyOption | CuisineOption | DietOption | DishTypeOption | MealTypeOption;

interface ClickableParamPanelProps {
    params: ParamOption[]
};

export default function ClickableParamPanel({ params }: ClickableParamPanelProps) {
    const panelDisplay = "definition" in params[0] ?
        params.map(p => {
            const pId = p.value.slice(0, 6);
            return (
                <div key={pId} id={`div-${pId}`}>
                    <label htmlFor={`${pId}`}>
                        {p.label}
                        <input type="checkbox" name={`${p.parameter}`} value={`${p.value}`} id={pId}></input>
                    </label>
                    <InfoIcon />
                </div>
            )
        }) :
        params.map(p => {
            const pId = p.value.slice(0, 7);
            return (
                <div key={pId} id={`div-${pId}`}>
                    <label htmlFor={`${pId}` }>
                        {p.label}
                        <input type="checkbox" name={`${p.parameter}`} value={`${p.value}`} id={pId}></input>
                    </label>
                </div>
            )
        });

    return panelDisplay;
};


/*
export const allergyOptions: AllergyOption[] = [
  {parameter: 'health', value: 'celery-free', label: 'Celery-free', definition: "Does not contain celery or derivatives"},
  {parameter: 'health', value: 'crustacean-free', label: 'Crustacean-free', definition: "Does not contain crustaceans (shrimp, lobster etc.) or derivatives"},
  {parameter: 'health', value: 'dairy-free', label: 'Dairy-free', definition: "No dairy; no lactose"},
  {parameter: 'health', value: 'egg-free', label: 'Egg-free', definition: "No eggs or products containing eggs"},
  {parameter: 'health', value: 'fish-free', label: 'Fish-free', definition: "No fish or fish derivatives"},
  {parameter: 'health', value: 'gluten-free', label: 'Gluten-free', definition: "No ingredients containing gluten"},
  {parameter: 'health', value: 'lupine-free', label: 'Lupine-free', definition: "Does not contain lupine (a legume) or its derivatives"},
  {parameter: 'health', value: 'mollusk-free', label: 'Mollusc-free', definition: "No molluscs, including clams, mussels, oysters, scallops, squid, octopus, snails, and more"},
  {parameter: 'health', value: 'mustard-free', label: 'Mustard-free', definition: "Does not contain mustard or derivatives"},
  {parameter: 'health', value: 'peanut-free', label: 'Peanut-free', definition: "No peanuts or products containing peanuts"},
  {parameter: 'health', value: 'sesame-free', label: 'Sesame-free', definition: "Does not contain sesame seed or derivatives"},
  {parameter: 'health', value: 'shellfish-free', label: 'Shellfish-free', definition: "No shellfish or shellfish derivatives"},
  {parameter: 'health', value: 'soy-free', label: 'Soy-free', definition: "No soy or products containing soy"},
  {parameter: 'health', value: 'sulfite-free', label: 'Sulfite-free', definition: "No sulfites"},
  {parameter: 'health', value: 'tree-nut-free', label: 'Tree-Nut-free', definition: "No tree nuts or products containing tree nuts"},
  {parameter: 'health', value: 'wheat-free', label: 'Wheat-free', definition: "No wheat, but can still contain gluten"}
];
*/