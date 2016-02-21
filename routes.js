import express from 'express'
import gtfs from 'gtfs'

const routes = express.Router()

const agency_key = 'county-connection'

routes.get('/', (req, res) => {
    res.send('hey')
})

// get stops near lat/ long
routes.get('/near/:lat/:long/:radius?', (req, res) => {

    const lat = Number(req.params.lat)
    const long = Number(req.params.long)
    const radius = Number(req.params.radius) || 20


    if(!lat || !long){
        return res.send({
            status: 'Bad Request',
            message: 'Please provide lat/long',
        })
    }

    // find routes near lat/long area
    gtfs.getStopsByDistance(lat, long, radius, function(err, rts) {
            if(err) {
                console.log(err)
                return res.send({
                    status: 'Bad Request',
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

// get stops on route by route_id and direction
routes.get('/stops/:route_id/:direction_id/:radius?', (req, res) => {

    const route_id = Number(req.params.route_id)
    const direction_id = Number(req.params.direction_id)

    if(!route_id || !direction_id){
        return res.send({
            status: 'Bad Request',
            message: 'Please provide route_id/direction_id',
        })
    }

    // find stops within route
    gtfs.getStopsByRoute(agency_key, route_id, direction_id, function(err, stops) {
            if(err) {
                console.log(err)
                return res.send({
                    status: 'Bad Request',
                    message: 'No stops within route',
                    error: err
                })
            }

            return res.send({
                status: 'Success',
                data: stops
            })

    })

})

// get stops on route by route_id and direction
routes.get('/routes/:stop_id', (req, res) => {

    const stop_id = Number(req.params.stop_id)

    if(!stop_id){
        return res.send({
            status: 'Bad Request',
            message: 'No routes for the given stop',
        })
    }

    console.log(agency_key, stop_id)

    gtfs.getRoutesByStop(agency_key, stop_id, function(err, rts) {
        if(err) {
            console.log(err)
            return res.send({
                status: 'Bad Request',
                message: 'No stops within route',
                error: err
            })
        }

        return res.send({
            status: 'Success',
            data: rts
        })
    });

})

export default routes
