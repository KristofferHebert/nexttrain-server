import express from 'express'
import xml2json from 'xml2json'
import config from './config.js'

const routes = express.Router()

// configure request
const request = require('request')
// const request = require('cached-request')(rqst)
// request.setCacheDirectory('tmp/cache')

// pass All requests to BART API
routes.get('/realtime/', (req, res) => {

    let url = req.params['url']

	let url = config.base + url
	let options = {
		url: url,
	}

    const xmlOptions = {
        object: true,
        coerce: true,
        sanitize: true,
        trim: true
    }

	request(options, function(error, response, body) {

        // error send error response
		if (error) {
			return req.json({
				error: error
			})
		}

		// if bad request send error
		if (response.statusCode !== 200) {
			return res.json({
				error: "bad request"
			})
		}

		// Convert data from XML to JSON
		let data = xml2json.toJson(body, xmlOptions)

        // Disable caching for content files
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

		return res.json({
			data: data.root
		})
	})

})

routes.get('/all', function(req, res){


    function fetchXML(station) {
      return new Promise((resolve, reject) => {

          let url = "http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=" + station + "&key=MW9S-E7SL-26DU-VV8V"

          let options = {
      		url: url,
      	  }

          request(options, function(error, response, body) {

              // If error send error response
              if (error) {
                return       reject(error)
              }

              // if bad request send error
              if (response.statusCode !== 200) {
                 return       reject(error)
              }

              // Convert data from XML to JSON
              const xmlOptions = {
                  object: true,
                  coerce: true,
                  sanitize: true,
                  trim: true
              }

              let data = xml2json.toJson(body, xmlOptions)

              return resolve(data.root)

          })
      })
    }

    const stations = ["12TH", "16TH", "19TH", "24TH", "ASHB", "BALB", "BAYF", "CAST", "CIVC", "COLS", "COLM", "CONC", "DALY", "DBRK", "DUBL", "DELN", "PLZA", "EMBR", "FRMT", "FTVL", "GLEN", "HAYW", "LAFY", "LAKE", "MCAR", "MLBR", "MONT", "NBRK", "NCON", "OAKL", "ORIN", "PITT", "PHIL", "POWL", "RICH", "ROCK", "SBRN", "SFIA", "SANL", "SHAY", "SSAN", "UCTY", "WCRK", "WDUB", "WOAK"]

    let itemPromises = stations.map(fetchXML);

    Promise.all(itemPromises)
      .then(function(response) {
        var results = {}
         response.forEach(function(item) {
             results[item.uri] = item
         });

         res.json({ stations : results })
      })
      .catch(function(err) {
        console.log("Failed:", err);
        res.json({ err: err })
      });

})

routes.get('/stnsched/:abbr', (req, res) => {
    let abbr = req.params['abbr'];

    if(!abbr) {
        return res.json({
            error: "bad request, please provide abbr for station"
        })
    }

	let url = config.base + "/api/sched.aspx?cmd=stnsched&orig=" + abbr + "&key=MW9S-E7SL-26DU-VV8V"

	let options = {
		url: url,
	}

    const xmlOptions = {
        object: true,
        coerce: true,
        sanitize: true,
        trim: true
    }

	request(options, function(error, response, body) {

        // error send error response
		if (error) {
			return req.json({
				error: error
			})
		}

		// if bad request send error
		if (response.statusCode !== 200) {
			return res.json({
				error: "bad request"
			})
		}

		// Convert data from XML to JSON
		let data = xml2json.toJson(body, xmlOptions)

        if(data){
            data.root.fullname = data.root.station.name
            data.root.name = data.root.station.abbr
            delete data.root.date
            delete data.root.uri
            delete data.root.station.name
            delete data.root.station.abbr
            delete data.root.message

            data.root.station.item.map((itm) => {
                delete itm.bikeflag
                return itm
            })
        }

		return res.json({
			data: data.root
		})
	})

})


export default routes
