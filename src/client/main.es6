"use strict"
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import drinksApp from './reducers.es6'
import loadSampleData from './loadSampleData.es6'
const ReactDOM = require('react-dom')
const React = require('react')
const ImbibleRouter = require('./components/ImbibleRouter.react.es6')

const store = createStore(drinksApp)
loadSampleData(store)
ReactDOM.render((
  <Provider store={store}>
    {ImbibleRouter.getRouter()}
  </Provider>
  ), document.body)

