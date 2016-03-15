import express from 'express'
import xml2json from 'xml2json'
import config from './config.js'

//const stations = ["12TH", "16TH", "19TH", "24TH", "ASHB", "BALB", "BAYF", "CAST", "CIVC", "COLS", "COLM", "CONC", "DALY", "DBRK", "DUBL", "DELN", "PLZA", "EMBR", "FRMT", "FTVL", "GLEN", "HAYW", "LAFY", "LAKE", "MCAR", "MLBR", "MONT", "NBRK", "NCON", "OAKL", "ORIN", "PITT", "PHIL", "POWL", "RICH", "ROCK", "SBRN", "SFIA", "SANL", "SHAY", "SSAN", "UCTY", "WCRK", "WDUB", "WOAK"]

const routes = express.Router()

// configure request
const request = require('request')
// const request = require('cached-request')(rqst)
// request.setCacheDirectory('tmp/cache')

// pass All requests to BART API
routes.get('*', (req, res) => {
	let url = config.base + req.originalUrl
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

export default routes
