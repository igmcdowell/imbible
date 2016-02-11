import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { addDrink } from '../actions.es6'
import drinksApp from '../reducers.es6'
const React = require('react')
const PureRenderMixin = require('react-addons-pure-render-mixin')
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const IndexLink = Router.IndexLink

const store = createStore(drinksApp)
store.dispatch(addDrink({name: 'a drink', id: 1, ingredients:[]}))


const ImbibleApp = React.createClass({
  mixins: [PureRenderMixin]

  , getInitialState() {
    return null
  }

  , componentDidMount() {

  }

  , componentWillUnmount() {

  }

  , componentWillMount() {
  }

  , _onChange() {

  }

  , render() {
    return (
      <Provider store={store}>
        <div>
          <div className="topbar">
            <h1><IndexLink to="/">Imbible</IndexLink></h1>
          </div>
          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      </Provider>
   )       
  }
})

module.exports = ImbibleApp
