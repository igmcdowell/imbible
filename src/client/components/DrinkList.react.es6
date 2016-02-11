import React, { PropTypes } from 'react'
import DrinkListItem from './DrinkListItem.react.es6'

const DrinkList = ({ drinks }) => (
  <ul>
    {drinks.map(drink =>
      <DrinkListItem
        key={drink.id}
        {...drink}
      />
    )}
  </ul>
)

DrinkList.propTypes = {
  drinks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired).isRequired,
}

export default DrinkList
