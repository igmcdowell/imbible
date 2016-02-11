import { combineReducers } from 'redux'
import { ADD_DRINK, ADD_INGREDIENT, ADD_DRINK_INGREDIENT } from './actions.es6'
const Immutable = require('immutable')

function drinks(state = Immutable.OrderedMap(), action) {
  switch (action.type) {
    case ADD_DRINK:
      return state.set(action.drink.id, action.drink)
    default:
      return state
  }
}

function drinkIngredients(state = Immutable.OrderedMap(), action) {
  switch (action.type) {
    case ADD_DRINK_INGREDIENT:
      return state.set(action.drinkIngredient.id, action.drinkIngredient)
    default:
      return state
  }
}

function ingredients(state = Immutable.OrderedMap(), action) {
  switch (action.type) {
    case ADD_INGREDIENT:
      return state.set(action.ingredient.id, action.ingredient)
    default:
      return state
  }
}

const drinksApp = combineReducers({
  drinks,
  drinkIngredients,
  ingredients,
})

export default drinksApp
