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
  drinks: PropTypes.object.isRequired,
}

export default DrinkList
