import { connect } from 'react-redux'
import IngredientList from '../components/SelectedIngredientList.react.es6'
import { removeSuggestion } from '../actions.es6'

const mapStateToProps = (state) => {
  return {
    ingredients: state.autoSuggest.get('pickedSuggestions')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeIngredient: (ingredient) => {
      dispatch(removeSuggestion(ingredient))
    }
  }
}

const LoadedIngredientList = connect(
  mapStateToProps,
  mapDispatchToProps
)(IngredientList)

export default LoadedIngredientList
