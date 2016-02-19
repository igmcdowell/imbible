import React from 'react'
import { connect } from 'react-redux'
import IngredientAutoSuggest from '../components/IngredientAutoSuggest.react.es6'
import { changeSuggestInput, updateSuggestionRequested } from '../actions.es6'

function makeSuggestionGetter(allSuggestions) {
  return (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : allSuggestions.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }
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
  const suggestions = state.autoSuggest.get('suggestions')
  const suggestionGetter = makeSuggestionGetter(ownProps.ingredients)
  const inputProps = {
      value,
      placeholder: 'Type an ingredient',
  }
  return {
    getSuggestionValue,
    renderSuggestion, 
    inputProps,
    suggestions, 
    // onSuggestionUpdateRequested: makeOnSuggestionsUpdateRequested(suggestionGetter), 
    getSuggestions: suggestionGetter,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event, { newValue }) => {
      dispatch(changeSuggestInput(newValue))
    },
    onSuggestionsUpdateRequested: ({value}) => {
      const getter = makeSuggestionGetter(ownProps.ingredients)
      const result = getter(value)

      dispatch(updateSuggestionRequested(result)) 
      // want to fire an update with new set of suggestions
    },
    onSuggestionSelected: (event, { suggestion, suggestionValue, method }) => {

    }
  }
}


const IngredientAutoSuggestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IngredientAutoSuggest)

export default IngredientAutoSuggestContainer
