import React, { PropTypes } from 'react'
import Autosuggest from 'react-autosuggest'


const IngredientAutoSuggest = ({ suggestions, getSuggestionValue, renderSuggestion, onSuggestionSelected, inputProps, onChange }) => (
  <Autosuggest suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   onSuggestionSelected={onSuggestionSelected}
                   inputProps={ Object.assign(inputProps, {onChange}) } />
)

IngredientAutoSuggest.propTypes = {
  suggestions: React.PropTypes.array.isRequired, 
  getSuggestionValue: React.PropTypes.func.isRequired, 
  renderSuggestion: React.PropTypes.func.isRequired, 
  onSuggestionSelected: React.PropTypes.func.isRequired, 
  inputProps: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

export default IngredientAutoSuggest
