import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const DrinkListItem = ({ name, id }) => (
  <li>
    <Link to={`/drinks/${id}`}>{name}</Link>
  </li>
)

DrinkListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}

export default DrinkListItem
