import {IngredientOrType} from '../../types/ingredients';

export const ADD_DRINK = 'ADD_DRINK';
export const ADD_DRINK_INGREDIENT = 'ADD_DRINK_INGREDIENT';
export const ADD_INGREDIENT_TYPE = 'ADD_INGREDIENT_TYPE';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const SUGGESTION_ADDED = 'SUGGESTION_ADDED';
export const SUGGESTION_REMOVED = 'SUGGESTION_REMOVED';

interface ChangeSuggestAction {
  type: typeof INPUT_CHANGE;
  value: string;
}

interface AddSuggestionAction {
  type: typeof SUGGESTION_ADDED;
  suggestion: IngredientOrType;
}

interface RemoveSuggestionAction {
  type: typeof SUGGESTION_REMOVED;
  id: number;
}

export type SuggestActions = ChangeSuggestAction | AddSuggestionAction | RemoveSuggestionAction;

export function changeSuggestInput(value: string): ChangeSuggestAction {
  return {type: INPUT_CHANGE, value};
}

export function addSuggestion(suggestion: IngredientOrType): AddSuggestionAction {
  return {type: SUGGESTION_ADDED, suggestion};
}

export function removeSuggestion(id: number): RemoveSuggestionAction {
  return {type: SUGGESTION_REMOVED, id};
}
