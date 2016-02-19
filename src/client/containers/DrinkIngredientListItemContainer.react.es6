import { connect } from 'react-redux'
import DrinkIngredientListItem from '../components/DrinkIngredientListItem.react.es6'

const mapStateToProps = (state, ownProps) => {
  const ingredientName = state.ingredients.get(ownProps.ingredientId).name
  return {
    name: ingredientName,
    amount: ownProps.amount,
    unit: ownProps.unit,
    id: ownProps.id,
  }
}

const DrinkIngredientListItemContainer = connect(
  mapStateToProps
)(DrinkIngredientListItem)

export default DrinkIngredientListItemContainer
