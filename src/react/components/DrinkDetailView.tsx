import * as React from 'react';
import {FullState} from '../../../types/ingredients';
import {useSelector} from 'react-redux';
import {match} from 'react-router-dom';

export const DrinkDetailView = ({match}: {match: match<{id: string}>}) => {
  const drinkId = parseInt(match.params.id, 10);
  const getDrink = (state: FullState) => {
    const drink = state.drinks.drinks.find((drink) => drink.id === drinkId);
    return {...drink}
  }
  const {name, drinkIngredients} = useSelector(getDrink)
  return <div className="card">
    <h2>{name}</h2>
    <ul className="drink-ingredient-list">
    {drinkIngredients.map(({name:ingredientName, ingredientId, amount, unit}) =>
      <li key={ingredientId}>
        {amount}{unit} {ingredientName}
      </li>
    )}
    </ul>
  </div>
}
