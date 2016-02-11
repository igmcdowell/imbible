export const ADD_DRINK = 'ADD_DRINK'
export const ADD_DRINK_INGREDIENT = 'ADD_DRINK_INGREDIENT'
export const ADD_INGREDIENT = 'ADD_INGREDIENT'
export function addDrink(drink) {
  return { type: ADD_DRINK, drink }
}

export function addDrinkIngredient(drinkIngredient) {
  return { type: ADD_DRINK_INGREDIENT, drinkIngredient }
}

export function addIngredient(ingredient) {
  return { type: ADD_INGREDIENT, ingredient }
}
