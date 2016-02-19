import React from 'react'
import { connect } from 'react-redux'
import IngredientAutoSuggest from '../components/IngredientAutoSuggest.react.es6'
import { changeSuggestInput, addSuggestion } from '../actions.es6'

function getSuggestions(allSuggestions, value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  const arr = inputLength === 0 ? [] : allSuggestions.filter(ingredient =>
    ingredient.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
  return arr.slice(0,20)
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
