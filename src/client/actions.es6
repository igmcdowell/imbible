export const ADD_DRINK = 'ADD_DRINK'
export const ADD_DRINK_INGREDIENT = 'ADD_DRINK_INGREDIENT'
export const ADD_INGREDIENT_TYPE = 'ADD_INGREDIENT_TYPE'
export const ADD_INGREDIENT = 'ADD_INGREDIENT'
export const INPUT_CHANGE = 'INPUT_CHANGE'
export const SUGGESTION_ADDED = 'SUGGESTION_ADDED'
export const SUGGESTION_REMOVED = 'SUGGESTION_REMOVED'

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

export function addSuggestion(suggestion) {
  return { type: SUGGESTION_ADDED, suggestion }
}

export function removeSuggestion(id) {
  return { type: SUGGESTION_REMOVED, id } 
}
