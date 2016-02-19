"use strict"
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'

import drinksApp from './reducers.es6'
import loadSampleData from './loadSampleData.es6'
import router from './components/ImbibleRouter.react.es6'

const store = createStore(drinksApp)
loadSampleData(store)
ReactDOM.render((
  <Provider store={store}>
    {router}
  </Provider>
  ), document.body)

