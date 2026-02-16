/*
q: query string
ingr: ingredient number (1 or more is 1%2B, 1 to 2 is 1-2, at most 1 is simply 1)
    const NUMERIC_RANGE_REGEX =
        /^(?:\d+(?:\.\d+)?|\d+(?:\.\d+)?\+|\d+(?:\.\d+)?-\d+(?:\.\d+)?)$/;
diet
health
cuisineType
mealType
dishType
calories: kCal per serving, numeric range input like "ingr"
time: minutes of prep time
glycemicIndex: "FLOAT-RANGE", unclear if open ranges are accepted
inflammatoryIndex: "FLOAT-RANGE", unclear if open ranges are accepted,
excluded: take an array of strings, convert to "excluded=food1&food2&food3"
random: boolean, randomizes results
nutrients[X]: each specific nutrient, must be in that format, takes numeric ranges like ingr
field: specifies fields to include in the response, uses these parameters, availabe values in docs, it's extensive
*/

export interface AllergyOption {
    parameter: "health",
    value: HealthLabel,
    label: string,
    definition: string
}

export type CuisineType =
  | 'american'
  | 'asian'
  | 'british'
  | 'caribbean'
  | 'central europe'
  | 'chinese'
  | 'eastern europe'
  | 'french'
  | 'greek'
  | 'indian'
  | 'italian'
  | 'japanese'
  | 'korean'
  | 'kosher'
  | 'mediterranean'
  | 'mexican'
  | 'middle eastern'
  | 'nordic'
  | 'south american'
  | 'south east asian'
  | 'world';

export interface CuisineOption {
    parameter: "cuisineType",
    value: CuisineType,
    label: string
}

export interface DietOption {
    parameter: "diet" | "health",
    value: string,
    label: string,
    definition: string
}

export type DietLabel =
  | 'balanced'
  | 'high-fiber'
  | 'high-protein'
  | 'low-carb'
  | 'low-fat'
  | 'low-sodium';

  export type DishType =
  | 'alcohol cocktail'
  | 'biscuits and cookies'
  | 'bread'
  | 'cereals'
  | 'condiments and sauces'
  | 'desserts'
  | 'drinks'
  | 'egg'
  | 'ice cream and custard'
  | 'main course'
  | 'pancake'
  | 'pasta'
  | 'pastry'
  | 'pies and tarts'
  | 'pizza'
  | 'preps'
  | 'preserve'
  | 'salad'
  | 'sandwiches'
  | 'seafood'
  | 'side dish'
  | 'soup'
  | 'special occasions'
  | 'starter'
  | 'sweets';

export interface DishTypeOption {
    parameter: "dishType",
    value: string,
    label: string
}

interface EdamamDigestEntry {
    label: string,
    tag: string,
    schemaOrgTag: string,
    total: number,
    hasRDI: boolean,
    daily: number,
    unit: string,
    sub: unknown
}

export interface EdamamError {
    errorCode: string,
    message: string,
    params: string[]
}

interface EdamamHit {
    recipe: {
        uri: string,
        label: string,
        image: string,
        images: {
            THUMBNAIL: EdamamImageInfo,
            SMALL: EdamamImageInfo,
            REGULAR: EdamamImageInfo,
            LARGE: EdamamImageInfo
        },
        source: string,
        url: string,
        shareAs: string,
        yield: number,
        dietLabels: string[],
        healthLabels: string[],
        cautions: string[],
        ingredientLines: string[],
        ingredients: IngredientResult[],
        calories: number,
        glycemicIndex: number,
        inflammatoryIndex: number,
        totalCO2Emissions: number
        co2EmissionsClass: string,
        totalWeight: number,
        cuisineType: string[],
        mealType: string[],
        dishType: string[],
        instructionLines: string[],
        tags: string[],
        externalId: string,
        totalNutrients: {
            [key: string]: NutrientInfo
        },
        totalDaily: {
            [key: string]: NutrientInfo
        },
        digest: EdamamDigestEntry[]
    },
    _links: EdamamLinkObject
}

interface EdamamImageInfo {
    url: string,
    width: number,
    height: number
}

interface EdamamLinkObject {
    self: {
        href: string,
        title: string
    },
    next: {
        href: string,
        title: string
    }
}

export interface EdamamResponse {
    from: number,
    to: number,
    count: number,
    _links: EdamamLinkObject,
    hits: EdamamHit[]
}

export interface EdamamRecipeEntry {
    quantity: number,
    measure: string | null,
    item: string
}

export interface EdamamShoppingEntry {
    foodId: string,
    food: string,
    quantities: {
        quantity: number,
        measure: string,
        qualifiers: string[]
    }[]
}

export type HealthLabel =
  | 'alcohol-cocktail'
  | 'alcohol-free'
  | 'celery-free'
  | 'crustacean-free'
  | 'dairy-free'
  | 'DASH'
  | 'egg-free'
  | 'fish-free'
  | 'fodmap-free'
  | 'gluten-free'
  | 'immuno-supportive'
  | 'keto-friendly'
  | 'kidney-friendly'
  | 'kosher'
  | 'low-fat-abs'
  | 'low-potassium'
  | 'low-sugar'
  | 'lupine-free'
  | 'Mediterranean'
  | 'mollusk-free'
  | 'mustard-free'
  | 'no-oil-added'
  | 'paleo'
  | 'peanut-free'
  | 'pescatarian'
  | 'pork-free'
  | 'red-meat-free'
  | 'sesame-free'
  | 'shellfish-free'
  | 'soy-free'
  | 'sugar-conscious'
  | 'sulfite-free'
  | 'tree-nut-free'
  | 'vegan'
  | 'vegetarian'
  | 'wheat-free';

// Edamam doc appears to have errors in type specification of measure and food. Verify them with testing later.
export interface IngredientResult {
    foodId: string,
    quantity: number,
    measure: string,
    weight: number,
    food: string,
    foodCategory: string
}

export type MealType =
  | 'breakfast'
  | 'brunch'
  | 'lunch/dinner'
  | 'snack'
  | 'teatime';

export interface MealTypeOption {
    parameter: "mealType",
    value: "breakfast" | "brunch" | "lunch/dinner" | "snack" | "teatime",
    label: "Breakfast" | "Brunch" | "Lunch or dinner" | "Snack" | "Teatime"
}

export type NutrientCode =
  | 'CA'
  | 'CHOCDF'
  | 'CHOCDF.net'
  | 'CHOLE'
  | 'ENERC_KCAL'
  | 'FAMS'
  | 'FAPU'
  | 'FASAT'
  | 'FAT'
  | 'FATRN'
  | 'FE'
  | 'FIBTG'
  | 'FOLAC'
  | 'FOLDFE'
  | 'FOLFD'
  | 'K'
  | 'MG'
  | 'NA'
  | 'NIA'
  | 'P'
  | 'PROCNT'
  | 'RIBF'
  | 'SUGAR'
  | 'SUGAR.added'
  | 'Sugar.alcohol'
  | 'THIA'
  | 'TOCPHA'
  | 'VITA_RAE'
  | 'VITB12'
  | 'VITB6A'
  | 'VITC'
  | 'VITD'
  | 'VITK1'
  | 'WATER'       
  | 'ZN';

type NutrientInfo = Omit<NutrientResult, "uri">;

export interface NutrientOption {
    parameter: string,
    label: string,
    unit: "µg" | "mg" | "g"
}

export interface NutrientResult {
    uri: string,
    label: string,
    quantity: number,
    unit: string
}

type QuantRange = number | `${number}+` | `${number}-${number}`

export type QueryParam =
    {key: "q", value: string} |
    {key: "ingr", value: QuantRange} |
    {key: "diet", value: DietLabel} |
    {key: "health", value: HealthLabel} |
    {key: "cuisineType", value: CuisineType} |
    {key: "mealType", value: MealType} |
    {key: "dishType", value: DishType} |
    {key: "calories", value: QuantRange} |
    {key: "time", value: QuantRange} |
    {key: "glycemicIndex", value: QuantRange} |
    {key: "inflammatoryIndex", value: QuantRange} |
    {key: "excluded", value: RecipeField | RecipeField[]} |
    {key: "random", value: boolean} |
    {key: `nutrients[${NutrientCode}]`, value: QuantRange } |
    {key: "field", value: RecipeField}

/** Available recipe fields that can be requested in the response */
export type RecipeField =
  | 'uri'
  | 'label'
  | 'image'
  | 'images'
  | 'source'
  | 'url'
  | 'shareAs'
  | 'yield'
  | 'dietLabels'
  | 'healthLabels'
  | 'cautions'
  | 'ingredientLines'
  | 'ingredients'
  | 'calories'
  | 'glycemicIndex'
  | 'inflammatoryIndex'
  | 'totalCO2Emissions'
  | 'co2EmissionsClass'
  | 'totalWeight'
  | 'totalTime'
  | 'cuisineType'
  | 'mealType'
  | 'dishType'
  | 'totalNutrients'
  | 'totalDaily'
  | 'digest'
  | 'tags'
  | 'externalId';