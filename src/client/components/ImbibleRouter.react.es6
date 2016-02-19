import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from './ImbibleApp.react.es6'
import HomePage from './HomePage.react.es6'
import DrinkDetailContainer from '../containers/DrinkDetailContainer.react.es6'

const router = (
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute  component={HomePage}/>
      <Route path='/drinks/:id' component={DrinkDetailContainer} />
    </Route>
  </Router>
)

export default router
