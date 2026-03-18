import type { NutrientObj } from "../../../types";
import styles from "./NutritionFacts.module.css";

export default function NutritionFacts({ nutrients, daily, servings, calories }: {nutrients: NutrientObj, daily: NutrientObj, calories: number, servings: number} ) {
    
    return (
        <div className={styles.nutritionLabel}>
            <h2>Nutrition Facts</h2>

            <div className={styles.servings}>
                <span>{servings} servings per recipe</span>
            </div>

            <div className={`${styles.divider} ${styles.thick}`}></div>

            <span className={styles.amountPerServing}>Amount per serving</span>
            <div className={`${styles.row} ${styles.calories}`}>
                <span>Calories</span>
                <span>{Math.round(calories / servings)}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
                <span><strong>Total Fat</strong> {Math.round(nutrients.FAT.quantity / servings)}{nutrients.FAT.unit}</span>
                <span><strong>{Math.round(daily.FAT.quantity / servings)}%</strong></span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Saturated Fat {Math.round(nutrients.FASAT.quantity / servings)}{nutrients.FASAT.unit}</span>
                <span>{Math.round(daily.FASAT.quantity / servings)}%</span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Polyunsaturated Fat {Math.round(nutrients.FAPU.quantity / servings)}{nutrients.FAPU.unit}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Monounsaturated Fat {Math.round(nutrients.FAMS.quantity / servings)}{nutrients.FAMS.unit}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}><i>Trans</i> Fat {Math.round(nutrients.FATRN.quantity / servings)}{nutrients.FATRN.unit}</span>
            </div>
            <div className={styles.row}>
                <span><strong>Cholesterol</strong> {Math.round(nutrients.CHOLE.quantity / servings)}{nutrients.CHOLE.unit}</span>
                <span><strong>{Math.round(daily.CHOLE.quantity / servings)}%</strong></span>
            </div>
            <div className={styles.row}>
                <span><strong>Sodium</strong> {Math.round(nutrients.NA.quantity / servings)}{nutrients.NA.unit}</span>
                <span><strong>{Math.round(daily.NA.quantity / servings)}%</strong></span>
            </div>
            <div className={styles.row}>
                <span><strong>Total Carbohydrates</strong> {Math.round(nutrients.CHOCDF.quantity / servings)}{nutrients.CHOCDF.unit}</span>
                <span><strong>{Math.round(daily.CHOCDF.quantity / servings)}%</strong></span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Dietary Fiber {Math.round(nutrients.FIBTG.quantity / servings)}{nutrients.FIBTG.unit}</span>
                <span>{Math.round(daily.FIBTG.quantity / servings)}%</span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Total Sugars {Math.round(nutrients.SUGAR.quantity / servings)}{nutrients.SUGAR.unit}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.doubleIndented}>includes {Math.round(nutrients["SUGAR.added"].quantity / servings)}{nutrients["SUGAR.added"].unit} added sugars</span>
            </div>
            <div className={styles.row}>
                <span className={styles.indented}>Sugar alcohol {Math.round(nutrients["Sugar.alcohol"].quantity / servings)}{nutrients["Sugar.alcohol"].unit}</span>
            </div>
            <div className={styles.row}>
                <span><strong>Protein</strong> {Math.round(nutrients.PROCNT.quantity / servings)}{nutrients.PROCNT.unit}</span>
                <span><strong>{Math.round(daily.PROCNT.quantity / servings)}%</strong></span>
            </div>

            <div className={styles.divider}></div>
            
            <div className={styles.micro}>
                
                <div className={styles.row}>
                    <span>Vitamin A</span>
                    <span>{Math.round(daily.VITA_RAE.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin C</span>
                    <span>{Math.round(daily.VITC.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Calcium</span>
                    <span>{Math.round(daily.CA.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Iron</span>
                    <span>{Math.round(daily.FE.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Magnesium</span>
                    <span>{Math.round(daily.MG.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Potassium</span>
                    <span>{Math.round(daily.K.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Phosphorus</span>
                    <span>{Math.round(daily.P.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Zinc</span>
                    <span>{Math.round(daily.ZN.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin D</span>
                    <span>{Math.round(daily.VITD.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin E</span>
                    <span>{Math.round(daily.TOCPHA.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Thiamin (B1)</span>
                    <span>{Math.round(daily.THIA.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin B6</span>
                    <span>{Math.round(daily.VITB6A.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin B12</span>
                    <span>{Math.round(daily.VITB12.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Vitamin K</span>
                    <span>{Math.round(daily.VITK1.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Riboflavin</span>
                    <span>{Math.round(daily.RIBF.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Folate, DFE</span>
                    <span>{Math.round(daily.FOLDFE.quantity / servings)}%</span>
                </div>
                <div className={styles.row}>
                    <span>Niacin</span>
                    <span>{Math.round(daily.NIA.quantity / servings)}%</span>
                </div>
                
                <div className={styles.divider}></div>

                <div className={styles.row}>
                    <span>Water {Math.round(nutrients.WATER.quantity / servings)}{nutrients.WATER.unit}</span>
                </div>
                
            </div>
        </div>
    )
};