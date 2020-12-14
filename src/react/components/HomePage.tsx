import * as React from 'react'
import {DrinkList} from '../components/DrinkList'
import { IngredientAutoSuggest } from './IngredientAutoSuggest'

export const HomePage = () => (
    <div className="home">
      <IngredientAutoSuggest />
      <DrinkList />
    </div>
  )
