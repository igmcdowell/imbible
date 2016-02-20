import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const DrinkListItem = ({ name, id, source, ingredients }) => (
  <li>
    <Link to={`/drinks/${id}`}>{name}</Link> 
    <span className="source">{source}</span> 
    <br />
    <span className="ingredients">
      {ingredients.join(', ')}
    </span>
  </li>
)

DrinkListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  ingredients: PropTypes.array.isRequired,
  source: PropTypes.string.isRequired,
}

export default DrinkListItem
