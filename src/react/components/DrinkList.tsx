import * as React from 'react';
import { FullState } from '../../../types/ingredients'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const DrinkList = () => {
  const drinks = useSelector(getDrinks);
  return <ul className="card drink-list">
    {drinks.map(({id, name, source, drinkIngredients}) =>
      <li>
        <div className="drink-headline">
          <Link to={`/drinks/${id}`}>{name}</Link>
          <span className="source">{source}</span> 
        </div> 
        <span className="ingredients">
          {drinkIngredients.map(ing => ing.name).join(', ')}
        </span>
      </li>
    )}
  </ul>
}

const isSubset = (candidate: number[], arr: number[]) =>  {
  const len = candidate.length
  for (let i = 0; i < len; i++) {
    if(arr.indexOf(candidate[i]) === -1) return false
  }
  return true
}

const getDrinks = ({autoSuggest, drinks}: FullState) => {
  const selectedIngredientTypes = autoSuggest.pickedSuggestions.map(s => s.id)
  return drinks.drinks
    .filter(d => isSubset(selectedIngredientTypes, d.ingredientTypes.concat(d.ingredientSuperTypes)))
    .slice(0, 20)
}
