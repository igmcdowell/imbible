import { addDrink, addIngredient, addDrinkIngredient } from './actions.es6'

function loadSampleData(store) {
  const ingredients = [
    {
      id: 1,
      name: 'Old Grand-Dad Bonded',
      type: 'Bourbon Whiskey',
    },
    {
      id: 2,
      name: 'House Sweet Vermouth',
      type: 'Sweet Vermouth',
    },
    {
      id: 3,
      name: 'Angostura Bitters',
      type: 'Aromatic Bitters',
    },
  ]

  const drinkIngredients = [
    {
      id: 1,
      ingredientId: 1,
      drinkId: 1,
      amount: 2,
      unit: 'ounces'
    },
    {
      id: 2,
      ingredientId: 2,
      drinkId: 1,
      amount: 1,
      unit: 'ounces'
    },
    {
      id: 3,
      ingredientId: 3,
      drinkId: 1,
      amount: 2,
      unit: 'dashes'
    },  
  ]
  ingredients.forEach((ingredient) => store.dispatch(addIngredient(ingredient)))
  drinkIngredients.forEach((drinkIngredient) => store.dispatch(addDrinkIngredient(drinkIngredient)))

  store.dispatch(addDrink({
    name: 'Manhattan', 
    id: 1, 
    drinkIngredients:[1,2,3]
  }))
}

export default loadSampleData