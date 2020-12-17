import {combineReducers} from 'redux';
import {INPUT_CHANGE, SUGGESTION_ADDED, SUGGESTION_REMOVED, SuggestActions} from './actions';
import {AutoSuggestState, DrinkState} from '../../types/ingredients';
import {initialData} from './drinkData';

function autoSuggest(
  state: AutoSuggestState = {value: '', suggestions: [], pickedSuggestions: []},
  action: SuggestActions
) {
  switch (action.type) {
    case INPUT_CHANGE:
      return {...state, value: action.value};
    case SUGGESTION_ADDED:
      return {...state, pickedSuggestions: [...state.pickedSuggestions, action.suggestion], value: ''};
    case SUGGESTION_REMOVED:
      return {...state, pickedSuggestions: state.pickedSuggestions.filter(ingr => ingr.id !== action.id)};
    default:
      return state;
  }
}

function drinks(state: DrinkState = initialData, action: any) {
  return state;
}

const drinksApp = combineReducers({
  autoSuggest,
  drinks,
});

export default drinksApp;
