import React, { PropTypes } from 'react'
import SelectedIngredientListItem from './SelectedIngredientListItem.react.es6'

const SelectedIngredientList = ({ ingredients }) => (
  <ul className="selected-ingredients">
    {ingredients.map(ingredient =>
      <SelectedIngredientListItem
        key={ingredient.id}
        {...ingredient}
      />
    )}
  </ul>
)

SelectedIngredientList.propTypes = {
  ingredients: PropTypes.array.isRequired,
}

export default SelectedIngredientList
