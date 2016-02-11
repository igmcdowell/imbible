import React, { PropTypes } from 'react'

const DrinkListItem = ({ name, ingredients }) => (
  <li>
    {name}
  </li>
)

DrinkListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}

export default DrinkListItem