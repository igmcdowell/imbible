import React, { PropTypes } from 'react'
const Link = require('react-router').Link

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
