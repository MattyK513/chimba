// In-memory Set used to de-duplicate recipe results from the Edamam API.
// The API may return overlapping results between paginated requests,
// so IDs are cached here to ensure each recipe is only processed/rendered once.
//
// Note: This cache is session-scoped and resets when cleared or on page reload.

export const knownRecipes = new Set<string>();

export function markRecipeKnown(id: string) {
    knownRecipes.add(id);
}

export function recipeIsKnown(id: string) {
    return knownRecipes.has(id);
}

export function clearKnownRecipes() {
    knownRecipes.clear();
}
