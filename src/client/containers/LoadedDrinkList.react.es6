import { connect } from 'react-redux'
import DrinkList from '../components/DrinkList.react.es6'

const mapStateToProps = (state) => {
  return {
    drinks: state.drinks
  }
}

const LoadedDrinkList = connect(
  mapStateToProps
)(DrinkList)

export default LoadedDrinkList
