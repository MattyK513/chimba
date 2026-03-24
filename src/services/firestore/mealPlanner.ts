import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Ingredient, IngredientDetails, Meal, MealModuleData, MealPlanDay, MealPlans, SavedRecipe, SavedRecipeWithId, Unsubscribe } from "../../types";

/*
export function subscribeToGoals(uid: string, callback: (data: Goal[] | null) => void): Unsubscribe {
    const colRef = collection(db, `users/${uid}/goals`);
    return onSnapshot(colRef, (snapshot) => {
        const docList = snapshot.docs;
        const data = docList.map(doc => {
            // TODO: Find a more robust generalizable approach for this. (This was done because TypeScript can't prove that the data in the snapshot query fits my type)
            const { title } = doc.data();
            return {id: doc.id, title};
        });
        callback(data);
    });
};
*/

export function subscribeToMealPlans(uid: string, callback: (data: MealPlans | null) => void): Unsubscribe {
    const colRef = collection (db, `users/${uid}/mealPlans`);
    return onSnapshot(colRef, (snapshot) => {
        const data: MealPlans = {};
        const docList = snapshot.docs;
        docList.forEach(doc => {
            const date = doc.id;
            const { breakfast, lunch, dinner, snack } = doc.data() as MealPlanDay;
            data[date] = {breakfast, lunch, dinner, snack};
        });
        callback(data);
    });
};

export function subscribeToGroceryList(uid: string, callback: (data: Ingredient[] | null) => void): Unsubscribe {
    const colRef = collection (db, `users/${uid}/groceryList`);
    return onSnapshot(colRef, (snapshot) => {
        const docList = snapshot.docs;
        const data = docList.map(doc => {
            const food = doc.id;
            const { price, quantity, measure } = doc.data() as IngredientDetails;
            return { food, price, quantity, measure };
        });
        callback(data);
    });
};

export function subscribeToSavedRecipes(uid: string, callback: (data: SavedRecipeWithId[] | null) => void): Unsubscribe {
    const colRef = collection (db, `users/${uid}/savedRecipes`);
    return onSnapshot(colRef, (snapshot) => {
        const docList = snapshot.docs;
        const data = docList.map(doc => {
            const id = doc.id;
            const { edamamName, ingredients, isFromEdamam, outsideLink, recipeLabel } = doc.data() as SavedRecipe;
            return { edamamName, id, ingredients, isFromEdamam, outsideLink, recipeLabel };
        });
        callback(data);
    });
};

export async function setMeal(uid: string, date: string, data: Partial<Record<"breakfast" | "lunch" | "dinner" | "snack", Meal>>) {
    const docRef = doc(db, `users/${uid}/mealPlans/${date}`);
    await setDoc(docRef, data, {merge: true});
};

export async function deleteMeal(uid:string) {};
/*
export interface MealPlanDay {
  breakfast: Meal | null,
  lunch: Meal | null,
  dinner: Meal | null,
  snack: Meal | null  
};

export type MealPlans = Record<string, MealPlanDay>;

export interface Meal {
    recipeLabel: string,
    ingredients: Ingredient[]
};
*/