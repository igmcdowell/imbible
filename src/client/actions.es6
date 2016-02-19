export const ADD_DRINK = 'ADD_DRINK'
export const ADD_DRINK_INGREDIENT = 'ADD_DRINK_INGREDIENT'
export const ADD_INGREDIENT_TYPE = 'ADD_INGREDIENT_TYPE'
export const ADD_INGREDIENT = 'ADD_INGREDIENT'
export const SUGGESTIONS_UPDATE_REQUESTED = 'SUGGESTIONS_UPDATE_REQUESTED'
export const INPUT_CHANGE = 'INPUT_CHANGE'
export const SUGGESTION_SELECTED = 'SUGGESTION_SELECTED'

export function addDrink(drink) {
  return { type: ADD_DRINK, drink }
}

export function addDrinkIngredient(drinkIngredient) {
  return { type: ADD_DRINK_INGREDIENT, drinkIngredient }
}

export function addIngredient(ingredient) {
  return { type: ADD_INGREDIENT, ingredient }
}

export function addIngredientType(ingredientType) {
  return { type: ADD_INGREDIENT_TYPE, ingredientType }
}

export function changeSuggestInput(value) {
  return { type: INPUT_CHANGE, value }
}

export function updateSuggestionRequested(suggestions) {
  return { type: SUGGESTIONS_UPDATE_REQUESTED, suggestions}
}

export function selectSuggestion(suggestion) {
  return { type: SUGGESTION_SELECTED, suggestion}
}
