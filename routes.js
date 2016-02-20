import express from 'express'
import gtfs from 'gtfs'

const routes = express.Router()

routes.get('/', (req, res) => {
    res.send('hey')
})

routes.get('/near/:lat/:long/:radius?', (req, res) => {

    const lat = req.params.lat
    const long = req.params.long
    const radius = req.params.radius

    // find routes near lat/long area
    gtfs.getRoutesByDistance(lat, long, radius, function(err, rts) {
            if(err) {
                res.status(401).send({
                    status: 'Bad Request',
                    error: err
                })
            }
    })

    console.log(rts)

    res.status(200).send({
        status: 'Success',
        data: rts
    })
})


export default routes
