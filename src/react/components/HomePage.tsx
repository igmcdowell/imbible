import * as React from 'react'
import {LoadedDrinkList} from '../containers/LoadedDrinkList'
import { IngredientAutoSuggest } from './IngredientAutoSuggest'

export const HomePage = () => (
    <div className="home">
      <IngredientAutoSuggest />
      <LoadedDrinkList />
    </div>
  )
