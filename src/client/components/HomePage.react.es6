import React from 'react'
import LoadedDrinkList from '../containers/LoadedDrinkList.react.es6'
import IngredientAutoSuggestContainer from '../containers/IngredientAutoSuggestContainer.react.es6'

const HomePage = () => (
    <div className="home">
      <IngredientAutoSuggestContainer></IngredientAutoSuggestContainer>
      <LoadedDrinkList></LoadedDrinkList>
    </div>
  )

export default HomePage
