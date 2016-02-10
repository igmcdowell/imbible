const _ = require('lodash')

let _isProduction = null
let _logToConsole = null

// logError takes a string or error, plus optional bonus data.
module.exports = {
  init(isProduction, logToConsole) {
    _isProduction = isProduction
    _logToConsole = logToConsole
  }
  
  , log(errorOrString, bonusData) {
    let error = errorOrString
    if(!(errorOrString instanceof Error)) {
      error = new Error(errorOrString)
    }

    if(_logToConsole) {
      console.error(new Date())
      console.error(error, error.stack)
      console.log('EXTRA ERROR DATA: ', bonusData)      
    }

  }
}
