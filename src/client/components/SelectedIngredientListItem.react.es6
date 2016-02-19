import React, { PropTypes } from 'react'

const IngredientListItem = ({ name, id, removeIngredient }) => (
  <li className="selected-ingredient">
    <span className="closer"
          onClick={removeIngredient.bind(this, id)}
    >X</span> 
    {name}
  </li>
)

IngredientListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  removeIngredient: PropTypes.func.isRequired,
}

export default IngredientListItem
