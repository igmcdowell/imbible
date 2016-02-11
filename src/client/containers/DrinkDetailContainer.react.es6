import { connect } from 'react-redux'
import DrinkDetailView from '../components/DrinkDetailView.react.es6'

const mapStateToProps = (state, ownProps) => {
  const drink = state.drinks.get(parseInt(ownProps.params.id))
  const drinkIngredients = drink.drinkIngredients.map( id => state.drinkIngredients.get(id))
  return {
    name: drink.name,
    id: drink.id,
    drinkIngredients: drinkIngredients,
  }
}

const DrinkDetailContainer = connect(
  mapStateToProps
)(DrinkDetailView)

export default DrinkDetailContainer
