"use strict"
const ReactDOM = require('react-dom')
const ReactRouter = require('react-router')
const Router = ReactRouter.Router;
const ImbibleRouter = require('./components/ImbibleRouter.react.es6')
const _ = require('lodash')

const router = ImbibleRouter.getRouter()
ReactDOM.render(router, document.body)
// router.run(function (Handler, state) {
//   const params = state.params
//   React.render(<Handler params={params}/>, document.body)
// })
