const React = require('react')
const PureRenderMixin = require('react-addons-pure-render-mixin')
const Router = require('react-router')
const RouteHandler = Router.RouteHandler
const IndexLink = Router.IndexLink

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
      <div>
        <div className="topbar">
          <h1><IndexLink to="/">Imbible</IndexLink></h1>
        </div>
        <div className="main-content">
          {this.props.children}
        </div>
      </div>
   )       
  }
})

module.exports = ImbibleApp
