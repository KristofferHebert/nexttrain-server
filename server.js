'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

import config from './config'
import routes from './routes'

const app = express()


// Compress all requests
app.use(compression())

// Enable URL parser
app.use(bodyParser.urlencoded({ extended: false }))

// Enable JSON parser
app.use(bodyParser.json())

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Add routes
app.use(routes)

// Launch app on PORT 8082
app.listen(config.port, () => {
    console.log('Listening on PORT ', config.port)
})
