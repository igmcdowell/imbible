let router

module.exports = {
  getRouter() {
    return router
  }
}

const ReactRouter = require('react-router')
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
const React = require('react')
const HomePage = require('./HomePage.react.es6')
const App = require('./ImbibleApp.react.es6')

const routes = (
  <Route path='/' component={App}>
    <IndexRoute  component={HomePage}/>
  </Route>
)

router = (<Router history={hashHistory}>{routes}</Router> )
