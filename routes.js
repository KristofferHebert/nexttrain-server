import express from 'express'
import xml2json from 'xml2json'
import config from './config.js'

const routes = express.Router()

// configure request
const rqst = require('request')
const request = require('cached-request')(rqst)
request.setCacheDirectory('tmp/cache')

// pass request to BART API
routes.get('*', (req, res) => {
    const url = config.base + req.originalUrl
    console.log(url)

    // set cache for 24hrs
    const options = {
        url: url,
        ttl: 86400
    }

    request(options, function (error, response, body) {
      if (error) {
        return req.json({
            error: error
        })
      }

      // if bad request send error
      if(response.statusCode !== 200){
          return res.json({
              status: "bad request"
          })
      }

      // convert data from XML to JSON
      let data = JSON.parse(xml2json.toJson(body))
      data = data.root

      res.json({
          status: "success",
          data: data
      })
    })

})

export default routes
