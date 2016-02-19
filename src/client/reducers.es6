import { combineReducers } from 'redux'
import { ADD_DRINK, ADD_INGREDIENT, ADD_INGREDIENT_TYPE, ADD_DRINK_INGREDIENT, INPUT_CHANGE, SUGGESTION_ADDED, SUGGESTION_REMOVED } from './actions.es6'
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

function ingredientTypes(state = Immutable.OrderedMap(), action) {
  switch (action.type) {
    case ADD_INGREDIENT_TYPE:
      return state.set(action.ingredientType.id, action.ingredientType)
    default:
      return state
  }
}

function autoSuggest(state = Immutable.Map({value: '', suggestions: [], pickedSuggestions: []}), action) {
  switch (action.type) {
    case INPUT_CHANGE:
      return state.set('value', action.value)
    case SUGGESTION_ADDED:
      return state.set('pickedSuggestions', state.get('pickedSuggestions').concat(action.suggestion)).set('value', '')
    case SUGGESTION_REMOVED:
      return state.set('pickedSuggestions', state.get('pickedSuggestions').filter(ingr => ingr.id !== action.id))
    default:
      return state
  }
}

const drinksApp = combineReducers({
  drinks,
  drinkIngredients,
  ingredients,
  ingredientTypes,
  autoSuggest,
})

export default drinksApp
