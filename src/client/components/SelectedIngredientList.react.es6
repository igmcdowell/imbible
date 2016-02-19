import React, { PropTypes } from 'react'
import SelectedIngredientListItem from './SelectedIngredientListItem.react.es6'

const SelectedIngredientList = ({ ingredients, removeIngredient }) => (
  <ul className="selected-ingredients">
    {ingredients.map(ingredient =>
      <SelectedIngredientListItem
        key={ingredient.id}
        removeIngredient={removeIngredient}
        {...ingredient}
      />
    )}
  </ul>
)

SelectedIngredientList.propTypes = {
  ingredients: PropTypes.array.isRequired,
  removeIngredient: PropTypes.func.isRequired,
}

export default SelectedIngredientList
