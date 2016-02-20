import { connect } from 'react-redux'
import DrinkListItem from '../components/DrinkListItem.react.es6'

const mapStateToProps = (state, ownProps) => {
  const drink = Object.apply({}, ownProps)
  drink.ingredients = ownProps.ingredientTypes.map(type => state.ingredientTypes.get(type).name)
  return drink
}

const DrinkListItemContainer = connect(
  mapStateToProps
)(DrinkListItem)

export default DrinkListItemContainer
