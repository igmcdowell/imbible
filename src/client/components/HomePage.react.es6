const React = require('react')
const PureRenderMixin = require('react-addons-pure-render-mixin')
const HomePage = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    return (
      <div className="home">
        Hello
      </div>
    )
  }
})

module.exports = HomePage
