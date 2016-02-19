import React, { PropTypes } from 'react'

const IngredientListItem = ({ name, id }) => (
  <li className="selected-ingredient">
    {name}
  </li>
)

IngredientListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}

export default IngredientListItem
