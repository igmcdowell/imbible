// Require our dependencies
"use-strict"
const express = require('express')
const http = require('http')
const url = require('url')
const morgan = require('morgan')
const co = require('co')
const bodyParser = require('body-parser')
const ErrorLogger = require('../shared/utils/ErrorLogger.es6')
const compression = require('compression')
require('stackup')

ErrorLogger.init(false, true)

// Create an express instance and set a port variable
const app = express()
const port = process.env.PORT || 3000

// Setup middleware
app.use(compression())
app.use(express.static(__dirname + '/../../public', {maxAge: '1y'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))


const server = require('http').Server(app)
server.listen(3000)


app.set('views', __dirname + '/../../views')
app.engine('html', require('ejs').renderFile)

const mainAppRoute = function (req, res) {
  co(function* (){
    try {
      res.render('./built/index.html')
    }
    catch(err) {
      ErrorLogger.log(err)
      res.status(500).json(error)
    }    
  })
}

app.get('/', mainAppRoute)
