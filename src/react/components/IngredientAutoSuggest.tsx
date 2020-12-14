import * as React from 'react'
import * as Autosuggest from 'react-autosuggest'
import {SelectedIngredientList} from '../components/SelectedIngredientList'
import { GetSuggestionValue, RenderSuggestion, OnSuggestionSelected, ChangeEvent, InputProps, SuggestionSelectedEventData } from 'react-autosuggest'
import { connect } from 'react-redux'
import { changeSuggestInput, addSuggestion } from '../actions'
import { FullState, IngredientOrType } from '../../../types/ingredients';
import { Dispatch } from 'redux';


type AutoSuggestProps = {
  getSuggestionValue: GetSuggestionValue<IngredientOrType>;
  suggestions: IngredientOrType[];
  renderSuggestion: RenderSuggestion<IngredientOrType>;
  onSuggestionSelected: OnSuggestionSelected<IngredientOrType>;
  // We build our onChange from dispatch and the rest of inputprops from state. 
  inputProps: Omit<InputProps<IngredientOrType>, "onChange">; 
  onChange(event: React.FormEvent<any>, params: ChangeEvent): void;
}

const UnconnectedIngredientAutoSuggest = ({ onChange, suggestions, getSuggestionValue, renderSuggestion, onSuggestionSelected, inputProps }: AutoSuggestProps) => (
  <>
    <Autosuggest<IngredientOrType> 
      suggestions={suggestions}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      // TODO: Seems like this is the preferred way of signaling a state, and we're running around it
      onSuggestionsFetchRequested={() => null}
      onSuggestionSelected={onSuggestionSelected}
      // TODO: this should be implemented
      onSuggestionsClearRequested={() => null}
      inputProps={{...inputProps, onChange}} 
    />
    <SelectedIngredientList />
  </> 
)

function getSuggestions(allSuggestions: IngredientOrType[], value: string) {
  const inputValue = value.trim().toLowerCase();
  const arr = inputValue.length === 0 ? [] : allSuggestions.filter(ingredient => {
    const idx = ingredient.name.toLowerCase().indexOf(value.toLowerCase());
    return idx !== -1 && (idx === 0 || ingredient.name[idx - 1] === ' ')
  })
  return arr.slice(0,20)
}

const mapStateToProps = ({autoSuggest: {value, pickedSuggestions}, drinks}: FullState) => {
  const availableIngredients = drinks.ingredientTypes.filter(ing => pickedSuggestions.indexOf(ing) === -1)
  return {
    getSuggestionValue: (suggestion: IngredientOrType) => suggestion.name,
    renderSuggestion: (suggestion: IngredientOrType) => <span>{suggestion.name}</span>, 
    inputProps:  {
      value,
      placeholder: 'Type an ingredient',
    },
    suggestions: getSuggestions(availableIngredients, value), 
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onChange: (event: React.FormEvent<any>, { newValue, method }: ChangeEvent) => {
      if (['type', 'escape', 'click'].includes(method)) dispatch(changeSuggestInput(newValue))
    },
    onSuggestionSelected: (event: React.FormEvent<any>, { suggestion, suggestionValue, method }: SuggestionSelectedEventData<IngredientOrType>) => {
      dispatch(addSuggestion(suggestion))
    }
  }
}

export const IngredientAutoSuggest = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedIngredientAutoSuggest)
