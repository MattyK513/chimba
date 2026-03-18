export const knownRecipes = new Set<string>();

export function markRecipeKnown(id: string) {
    knownRecipes.add(id);
};

export function recipeIsKnown(id: string) {
    return knownRecipes.has(id);
};

export function clearKnownRecipes() {
    knownRecipes.clear();
};