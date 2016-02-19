const React = require('react')
const PureRenderMixin = require('react-addons-pure-render-mixin')
import LoadedDrinkList from '../containers/LoadedDrinkList.react.es6'
import IngredientAutoSuggestContainer from '../containers/IngredientAutoSuggestContainer.react.es6'
const HomePage = React.createClass({
  mixins: [PureRenderMixin]
  , render() {
    return (
      <div className="home">
        <IngredientAutoSuggestContainer></IngredientAutoSuggestContainer>
        <LoadedDrinkList></LoadedDrinkList>
      </div>
    )
  }
})

HomePage.contextTypes = {
  store: React.PropTypes.object.isRequired
};

module.exports = HomePage
