import type { Dispatch, SetStateAction } from "react";
import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import type { CollectionReference, DocumentReference, QuerySnapshot } from "firebase/firestore";

export type { AuthError as AuthErrorType } from "firebase/auth";

/** Ensures at least one property from T is present. */
export type AtLeastOne<T, Keys extends keyof T = keyof T> =
    Keys extends keyof T
        ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
        : never;

export type AuthStateSetter = Dispatch<SetStateAction<UserInfo | null>>;

export interface AuthStateType {
    loading: boolean;
    user: UserInfo | null;
}

/** Fields that can be updated on a user's profile. */
export interface EditableUserProfileFields {
    displayName?: string | null;
    email?: string;
    phoneNumber?: string | null;
    photoURL?: string | null;
}

export interface Goal {
    id: string;
    title: string;
}

/** Available data modules for lazy Firestore subscriptions. */
export type ModuleName = "goals" | "mealPlans" | "savedRecipes" | "groceryList" | "profileData";

export type SubState = Record<ModuleName, SubStateEntry>;

export interface SubStateEntry {
    count: number;
    unsubscribe: Unsubscribe | null;
}

export type UpdateUserProfile = AtLeastOne<EditableUserProfileFields>;

/** Context value exposing user data and subscription management. */
export interface UserDataContextType {
    goals: Goal[] | null;
    mealPlans: MealPlans | null;
    groceryList: Ingredient[] | null;
    savedRecipes: SavedRecipeWithId[] | null;
    profileData: UserProfileFields | null;
    addDependency: (module: ModuleName) => void;
    removeDependency: (module: ModuleName) => void;
}

/** Subset of Firebase User relevant to the app. */
export type UserInfo = Pick<
    User,
    | "displayName"
    | "email"
    | "emailVerified"
    | "phoneNumber"
    | "photoURL"
    | "uid"
    | "metadata"
>;

export interface UserMetadata {
    createdAt?: string;
    lastLoginAt?: string;
    lastSignInTime?: string;
    creationTime?: string;
}

export interface UserProfileFields {
    displayName: string | null;
    email: string;
    phoneNumber: string | null;
    photoURL: string | null;
}

export type Ingredient = IngredientDetails & {
    food: string;
};

export interface IngredientDetails {
    price: {
        amount: number | null;
        currency: "USD" | "COP" | null;
    } | null;
    quantity: number | null;
    measure: string | null;
}

export interface MealPlanDay {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snack: Meal | null;
}

export type MealPlans = Record<string, MealPlanDay>;

export interface Meal {
    recipeLabel: string;
    ingredients?: Ingredient[];
}

export interface SavedRecipe {
    edamamName: string | null;
    ingredients: Ingredient[] | null;
    isFromEdamam: boolean;
    outsideLink: URL;
    recipeLabel: string;
}

export type SavedRecipeWithId = SavedRecipe & {
    id: string;
};

export interface MealModuleData {
    groceryList: Ingredient[];
    mealPlans: MealPlans;
    savedRecipes: SavedRecipe[];
}

// Re-export Firebase types for convenience
export type { CollectionReference, DocumentReference, FirebaseError, QuerySnapshot, Unsubscribe, User };