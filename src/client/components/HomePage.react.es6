const React = require('react')
const PureRenderMixin = require('react-addons-pure-render-mixin')
import LoadedDrinkList from '../containers/LoadedDrinkList.react.es6'
const HomePage = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    return (
      <div className="home">
        <LoadedDrinkList></LoadedDrinkList>
      </div>
    )
  }
})

module.exports = HomePage
