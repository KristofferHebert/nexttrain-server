'use strict'

import express from 'express'
import bodyParser from 'body-parser'

import routes from './routes'

const app = express()


// Enable URL parser
app.use(bodyParser.urlencoded({ extended: false }))

// Enable JSON parser
app.use(bodyParser.json())

// Add routes
app.use(routes)

// Launch app on PORT 8082
app.listen(8084, () => {
    console.log('Listening on PORT 8084')
})
