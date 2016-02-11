import { combineReducers } from 'redux'
import { ADD_DRINK } from './actions.es6'

function drinks(state = [], action) {
  switch (action.type) {
    case ADD_DRINK:
      console.log('new drink detected', action)
      return [
        ...state,
        action.drink
      ]
    default:
      return state
  }
}

const drinksApp = combineReducers({
  drinks
})

export default drinksApp
