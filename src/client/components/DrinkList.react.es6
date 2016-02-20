import React, { PropTypes } from 'react'
import DrinkListItemContainer from '../containers/DrinkListItemContainer.react.es6'


const DrinkList = ({ drinks }) => (
  <ul className="card drink-list">
    {drinks.map(drink =>
      <DrinkListItemContainer
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
