import express from 'express'
import gtfs from 'gtfs'

const routes = express.Router()

const agency_key = 'county-connection'


routes.get('/', (req, res) => {
    res.send('hey')
})

routes.get('/near/:lat/:long/:radius?', (req, res) => {

    const lat = Number(req.params.lat)
    const long = Number(req.params.long)
    const radius = Number(req.params.radius) || 20

    // find routes near lat/long area
    gtfs.getStopsByDistance(lat, long, radius, function(err, rts) {∏
            if(err) {
                console.log(err)
                return res.send({
                    message: 'No stops within '+ radius +' miles',
                    error: err
                })
            }

            return res.send({
                status: 'Success',
                data: rts
            })

    })

})


export default routes
