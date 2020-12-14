import { connect } from 'react-redux'
import {DrinkList} from '../components/DrinkList'
import { FullState } from '../../../types/ingredients'
const isSubset = (candidate: number[], arr: number[]) =>  {
  const len = candidate.length
  for (let i = 0; i < len; i++) {
    if(arr.indexOf(candidate[i]) === -1) return false
  }
  return true
}

const mapStateToProps = (state: FullState) => {
  const selectedIngredientTypes = state.autoSuggest.pickedSuggestions.map(s => s.id)
  const availableDrinks = state.drinks.drinks.filter(d => isSubset(selectedIngredientTypes, d.ingredientTypes.concat(d.ingredientSuperTypes)))
  return {
    drinks: availableDrinks.slice(0,20)
  }
}

export const LoadedDrinkList = connect(
  mapStateToProps
)(DrinkList)
