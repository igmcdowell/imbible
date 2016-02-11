"use strict"
const ReactDOM = require('react-dom')
const ReactRouter = require('react-router')
const Router = ReactRouter.Router;
const ImbibleRouter = require('./components/ImbibleRouter.react.es6')
const _ = require('lodash')

ReactDOM.render(ImbibleRouter.getRouter(), document.body)
