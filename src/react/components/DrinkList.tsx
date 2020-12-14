import * as React from 'react';
import {IDrink, FullState } from '../../../types/ingredients'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const UnfilteredDrinkList = ({ drinks }: {drinks: IDrink[]}) => (
  <ul className="card drink-list">
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
)

const isSubset = (candidate: number[], arr: number[]) =>  {
  const len = candidate.length
  for (let i = 0; i < len; i++) {
    if(arr.indexOf(candidate[i]) === -1) return false
  }
  return true
}

const mapStateToProps = ({autoSuggest, drinks}: FullState) => {
  const selectedIngredientTypes = autoSuggest.pickedSuggestions.map(s => s.id)
  const availableDrinks = drinks.drinks.filter(d => isSubset(selectedIngredientTypes, d.ingredientTypes.concat(d.ingredientSuperTypes)))
  return {
    drinks: availableDrinks.slice(0,20)
  }
}

export const DrinkList = connect(
  mapStateToProps
)(UnfilteredDrinkList)
