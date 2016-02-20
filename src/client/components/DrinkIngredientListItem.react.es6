import React, { PropTypes } from 'react'

const DrinkIngredientListItem = ({ name, amount, unit }) => (
  <li>
    {amount}{unit} {name}
  </li>
)

DrinkIngredientListItem.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}

export default DrinkIngredientListItem
