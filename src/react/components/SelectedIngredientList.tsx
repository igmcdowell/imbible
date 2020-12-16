import * as React from 'react'
import { IIngredient, FullState } from '../../../types/ingredients'
import { useDispatch, useSelector } from 'react-redux';
import { removeSuggestion } from '../actions';

export const SelectedIngredientList = () => {
  const ingredients = useSelector((state: FullState) => state.autoSuggest.pickedSuggestions);
  const dispatch = useDispatch();
  const removeIngredient = (ingredientId: number) => dispatch(removeSuggestion(ingredientId))

  return <ul className="selected-ingredients">
    {ingredients.map(({id: ingredientId, name}: IIngredient) =>
      <li className="selected-ingredient" key={ingredientId}>
        <span className="closer"
          onClick={() => removeIngredient(ingredientId)}
        >X</span> 
        {name}
      </li>
    )}
  </ul>
};
