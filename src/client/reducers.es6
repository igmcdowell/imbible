import { combineReducers } from 'redux'
import { ADD_DRINK, ADD_INGREDIENT, ADD_DRINK_INGREDIENT, INPUT_CHANGE, SUGGESTIONS_UPDATE_REQUESTED } from './actions.es6'
import Immutable from 'immutable'

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

function autoSuggest(state = Immutable.Map({value: '', suggestions: []}), action) {
  switch (action.type) {
    case INPUT_CHANGE:
      return state.set('value', action.value)
    case SUGGESTIONS_UPDATE_REQUESTED:
      return state.set('suggestions', action.suggestions)
    default:
      return state
  }
}

const drinksApp = combineReducers({
  drinks,
  drinkIngredients,
  ingredients,
  autoSuggest,
})

export default drinksApp
