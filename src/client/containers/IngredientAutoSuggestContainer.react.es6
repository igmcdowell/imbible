import React from 'react'
import { connect } from 'react-redux'
import IngredientAutoSuggest from '../components/IngredientAutoSuggest.react.es6'
import { changeSuggestInput, addSuggestion } from '../actions.es6'

function getSuggestions(allSuggestions, value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : allSuggestions.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  )
}

function getSuggestionValue(suggestion) { 
  return suggestion.name;          
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function makeOnSuggestionsUpdateRequested(suggestionGetter) {
  return ({ value }) => {
    updateSuggestionRequested(suggestionGetter(value))
  }
}

const mapStateToProps = (state, ownProps) => {
  const value = state.autoSuggest.get('value')
  const availableIngredients = state.ingredientTypes
                                .toOrderedSet()
                                .subtract(state.autoSuggest
                                  .get('pickedSuggestions')
                                )
                                .toArray()
  const suggestions = getSuggestions(availableIngredients, value)
  const inputProps = {
      value,
      placeholder: 'Type an ingredient',
  }
  return {
    getSuggestionValue,
    renderSuggestion, 
    inputProps,
    suggestions, 
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event, { newValue, method }) => {
      if (['type', 'escape', 'click'].includes(method)) dispatch(changeSuggestInput(newValue))
    },
    onSuggestionSelected: (event, { suggestion, suggestionValue, method }) => {
      dispatch(addSuggestion(suggestion))
    }
  }
}

const IngredientAutoSuggestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IngredientAutoSuggest)

export default IngredientAutoSuggestContainer
