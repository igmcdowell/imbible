import React, { PropTypes } from 'react'
import DrinkIngredientListItemContainer from '../containers/DrinkIngredientListItemContainer.react.es6'

const DrinkIngredientList = ({ drinkIngredients }) => (
  <ul className="drink-ingredient-list">
    {drinkIngredients.map(drinkIngredient =>
      <DrinkIngredientListItemContainer
        key={drinkIngredient.id}
        {...drinkIngredient}
      />
    )}
  </ul>
)

DrinkIngredientList.propTypes = {
  drinkIngredients: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    drinkId: PropTypes.number.isRequired,
    ingredientId: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired).isRequired,
}

export default DrinkIngredientList
