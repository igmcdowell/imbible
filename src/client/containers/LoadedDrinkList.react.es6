import { connect } from 'react-redux'
import DrinkList from '../components/DrinkList.react.es6'
const isSubset = (candidate, arr) =>  {
  const len = candidate.length
  for (let i = 0; i < len; i++) {
    if(arr.indexOf(candidate[i]) === -1) return false
  }
  return true
}

const mapStateToProps = (state) => {
  const selectedIngredientTypes = state.autoSuggest.get('pickedSuggestions').map(s => s.id)
  console.log('sit', selectedIngredientTypes)
  const availableDrinks = state.drinks.filter(d => isSubset(selectedIngredientTypes, d.ingredientTypes))
  return {
    drinks: availableDrinks.slice(0,20)
  }
}

const LoadedDrinkList = connect(
  mapStateToProps
)(DrinkList)

export default LoadedDrinkList
