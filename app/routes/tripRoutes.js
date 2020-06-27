// require needed modules
const express = require('express')
const passport = require('passport')

// require local modules
const Trip = require('./../models/trip.js') // mongoose Trip model
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router for trips
const router = express.Router()

// define routes
// index (GET)
router.get('/trips', (req, res, next) => { // add back requireToken as second argument
  Trip.find()
    .then(trips => {
      res.status(200).json({trips})
    })
    .catch(next)
})

// create (POST)
router.post('/trips', requireToken, (req, res, next) => {
  req.body.trip.owner = req.user.id
  const tripInfo = req.body.trip
  Trip.create(tripInfo)
    .then(trip => res.status(201).json({trip}))
    .catch(next)
})

// show (GET)
router.get('/trips/:id', (req, res, next) => { // add back requireToken as second argument
  const tripId = req.params.id
  Trip.findById(tripId)
    .populate('owner')
    .then(handle404)
    .then(trip => {
      res.status(200).json({trip: trip})
    })
    .catch(next)
})

module.exports = router
