import * as React from 'react'
import { IIngredient, FullState } from '../../../types/ingredients'
import { connect } from 'react-redux';
import { removeSuggestion } from '../actions';
import { Dispatch } from 'redux';

type SelectedIngredeintProps = {
  ingredients: IIngredient[];
  removeIngredient: (id: number) => void;
}

const UnconnectedSelectedIngredientList = ({ingredients, removeIngredient}: SelectedIngredeintProps) => (
  <ul className="selected-ingredients">
    {ingredients.map(({id: ingredientId, name}: IIngredient) =>
      <li className="selected-ingredient" key={ingredientId}>
        <span className="closer"
              onClick={removeIngredient.bind(this, ingredientId)}
        >X</span> 
        {name}
      </li>
    )}
  </ul>
);


const mapStateToProps = (state: FullState) => {
  return {
    ingredients: state.autoSuggest.pickedSuggestions
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeIngredient: (ingredientId: number) => {
      dispatch(removeSuggestion(ingredientId))
    }
  }
}

export const SelectedIngredientList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedSelectedIngredientList)
