import * as React from 'react';
import {IDrinkIngredient, FullState} from '../../../types/ingredients';
import { connect } from 'react-redux';

const UnconnectedDrinkDetailView = ({name, drinkIngredients}: {name:string, drinkIngredients: IDrinkIngredient[]}) => (
  <div className="card">
    <h2>{name}</h2>
    <ul className="drink-ingredient-list">
    {drinkIngredients.map(({name:ingredientName, ingredientId, amount, unit}) =>
      <li key={ingredientId}>
        {amount}{unit} {ingredientName}
      </li>
    )}
    </ul>
  </div>
)

const mapStateToProps = (state: FullState, ownProps: {match: {params: {id: string}}}) => {
  const drink = state.drinks.drinks[parseInt(ownProps.match.params.id, 10)];
  return {...drink}
}

export const DrinkDetailView = connect(
  mapStateToProps
)(UnconnectedDrinkDetailView)
