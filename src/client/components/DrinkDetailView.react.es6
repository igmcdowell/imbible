import React, { PropTypes } from 'react'
import DrinkIngredientList from './DrinkIngredientList.react.es6'

const DrinkDetailView = ({ name, drinkIngredients }) => (
  <div className="card">
    <h2>{name}</h2>
    <DrinkIngredientList
      drinkIngredients={drinkIngredients}
    ></DrinkIngredientList>
  </div>
)

DrinkDetailView.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  drinkIngredients: PropTypes.array.isRequired,
}

export default DrinkDetailView
