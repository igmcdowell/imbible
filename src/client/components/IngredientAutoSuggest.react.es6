const React = require('react')
const PropTypes = React.PropTypes
const Autosuggest = require('react-autosuggest')


const IngredientAutoSuggest = ({ suggestions, onSuggestionsUpdateRequested, getSuggestionValue, renderSuggestion, inputProps, onChange }) => (
  <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={ Object.assign(inputProps, {onChange}) } />
)

IngredientAutoSuggest.propTypes = {
  suggestions: React.PropTypes.array.isRequired, 
  onSuggestionsUpdateRequested: React.PropTypes.func.isRequired, 
  getSuggestionValue: React.PropTypes.func.isRequired, 
  renderSuggestion: React.PropTypes.func.isRequired, 
  inputProps: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

export default IngredientAutoSuggest
