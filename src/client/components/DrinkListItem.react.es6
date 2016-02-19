import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const DrinkListItem = ({ name, id, source }) => (
  <li>
    <Link to={`/drinks/${id}`}>{name}</Link> <span className="source">{source}</span>
  </li>
)

DrinkListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
}

export default DrinkListItem
