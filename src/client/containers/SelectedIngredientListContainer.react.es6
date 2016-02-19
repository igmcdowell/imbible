import { connect } from 'react-redux'
import IngredientList from '../components/SelectedIngredientList.react.es6'

const mapStateToProps = (state) => {
  return {
    ingredients: state.autoSuggest.get('pickedSuggestions')
  }
}

const LoadedIngredientList = connect(
  mapStateToProps
)(IngredientList)

export default LoadedIngredientList
